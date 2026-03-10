import { Op } from "sequelize";
import { Contact } from "../models/contact.model";

export const identifyService = async (
  email?: string,
  phoneNumber?: string
) => {

  if (!email && !phoneNumber) {
    throw new Error("Email or phoneNumber required");
  }

  const conditions: any[] = [];
  if (email) conditions.push({ email });
  if (phoneNumber) conditions.push({ phoneNumber });

  // Find contacts matching email or phone
  const matchedContacts = await Contact.findAll({
    where: {
      [Op.or]: conditions
    },
    order: [["createdAt", "ASC"]]
  });

  // No contacts → create primary
  if (matchedContacts.length === 0) {

    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: "primary"
    });

    return {
      contact: {
        primaryContatctId: newContact.id,
        emails: email ? [email] : [],
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
        secondaryContactIds: []
      }
    };
  }

  // Find all related contacts
  const relatedIds = new Set<number>();

  matchedContacts.forEach(c => {
    relatedIds.add(c.id);
    if (c.linkedId) relatedIds.add(c.linkedId);
  });

  const relatedContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { id: Array.from(relatedIds) },
        { linkedId: Array.from(relatedIds) }
      ]
    },
    order: [["createdAt", "ASC"]]
  });

  // Determine primary contact (oldest)
  let primary = relatedContacts
    .filter(c => c.linkPrecedence === "primary")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    )[0];

  // Merge multiple primaries if needed
  const otherPrimaries = relatedContacts.filter(
    c => c.linkPrecedence === "primary" && c.id !== primary.id
  );

  for (const p of otherPrimaries) {

    await Contact.update(
      {
        linkPrecedence: "secondary",
        linkedId: primary.id
      },
      {
        where: { id: p.id }
      }
    );
  }

  // Check if new info requires secondary creation
  const emailExists = relatedContacts.some(c => c.email === email);
  const phoneExists = relatedContacts.some(
    c => c.phoneNumber === phoneNumber
  );

  if (
    (email && !emailExists) ||
    (phoneNumber && !phoneExists)
  ) {
    await Contact.create({
      email,
      phoneNumber,
      linkedId: primary.id,
      linkPrecedence: "secondary"
    });
  }

  //  Fetch final linked contacts
  const finalContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    },
    order: [["createdAt", "ASC"]]
  });

  // Build response
  const emails = [
    ...new Set(finalContacts.map(c => c.email).filter(Boolean))
  ];

  const phones = [
    ...new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean))
  ];

  const secondaryIds = finalContacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id);

  return {
    contact: {
      primaryContatctId: primary.id,
      emails,
      phoneNumbers: phones,
      secondaryContactIds: secondaryIds
    }
  };
};