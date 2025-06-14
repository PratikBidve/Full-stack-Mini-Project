import { Employee } from '../models/Employee';
import { User } from '../models/User';
import { generateToken, requireAuth, requireAdmin } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

export const resolvers = {
  Query: {
    employees: async (_: any, { filter, page = 1, limit = 10, sortBy, sortOrder }: any, { req }: { req: AuthRequest }) => {
      await requireAuth(req);
      
      const query: any = {};
      if (filter) {
        if (filter.name) query.name = new RegExp(filter.name, 'i');
        if (filter.class) query.class = filter.class;
        if (filter.minAge || filter.maxAge) {
          query.age = {};
          if (filter.minAge) query.age.$gte = filter.minAge;
          if (filter.maxAge) query.age.$lte = filter.maxAge;
        }
      }

      const sort: any = {};
      if (sortBy) {
        sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
      }

      const skip = (page - 1) * limit;
      
      return Employee.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    },

    employee: async (_: any, { id }: { id: string }, { req }: { req: AuthRequest }) => {
      await requireAuth(req);
      return Employee.findById(id);
    },

    me: async (_: any, __: any, { req }: { req: AuthRequest }) => {
      return requireAuth(req);
    }
  },

  Mutation: {
    createEmployee: async (_: any, { input }: any, { req }: { req: AuthRequest }) => {
      await requireAdmin(req);
      const employee = new Employee(input);
      return employee.save();
    },

    updateEmployee: async (_: any, { id, input }: any, { req }: { req: AuthRequest }) => {
      await requireAdmin(req);
      return Employee.findByIdAndUpdate(id, input, { new: true });
    },

    deleteEmployee: async (_: any, { id }: { id: string }, { req }: { req: AuthRequest }) => {
      await requireAdmin(req);
      const result = await Employee.findByIdAndDelete(id);
      return !!result;
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user);
      return {
        token,
        user
      };
    },

    register: async (_: any, { email, password, role }: { email: string; password: string; role: string }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = new User({ email, password, role });
      await user.save();

      const token = generateToken(user);
      return {
        token,
        user
      };
    }
  }
}; 