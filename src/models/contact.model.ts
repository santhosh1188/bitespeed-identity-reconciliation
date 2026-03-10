import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ContactAttributes {
  id: number;
  email?: string;
  phoneNumber?: string;
  linkedId?: number | null;
  linkPrecedence: "primary" | "secondary";
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface ContactCreationAttributes
  extends Optional<ContactAttributes, "id" | "linkedId"> {}

export class Contact
  extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes
{
  public id!: number;
  public email!: string;
  public phoneNumber!: string;
  public linkedId!: number | null;
  public linkPrecedence!: "primary" | "secondary";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
       field: "phone_number" 
    },

    linkedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "linked_id"

    },

    linkPrecedence: {
      type: DataTypes.ENUM("primary", "secondary"),
      allowNull: false,
      field: "link_precedence"
    },

    createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        field:"created_at"

    },

    updatedAt:{
        type:DataTypes.DATE,
        allowNull: false,
        field:"updated_at"
    },

    deletedAt:{
        type:DataTypes.DATE,
        allowNull:true,
        field:"deleted_at"
    }
  },
  {
    sequelize,
    tableName: "contacts",
    timestamps: true,
    paranoid: true
  }
);