import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    email: String!
    role: UserRole!
  }

  enum UserRole {
    ADMIN
    EMPLOYEE
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
  }

  input EmployeeFilter {
    name: String
    class: String
    minAge: Int
    maxAge: Int
  }

  type Query {
    employees(
      filter: EmployeeFilter
      page: Int
      limit: Int
      sortBy: String
      sortOrder: String
    ): [Employee!]!
    employee(id: ID!): Employee
    me: User
  }

  type Mutation {
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!, role: UserRole!): AuthPayload!
  }
`; 