import { supabase } from '../lib/supabase';
import { getActivePool, joinPoolMember } from './api';

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('Active Pool Visibility', () => {
  const mockUserId = 'user-123';
  const mockDate = '2025-01-01T12:00:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date(mockDate));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getActivePool', () => {
    it('should return a pool if the user is the creator', async () => {
      // Mock Creator Pools Response
      const mockCreatedPool = {
        id: 'pool-1',
        creator_id: mockUserId,
        title: 'Creator Pool',
        status: 'active',
        created_at: '2025-01-01T11:00:00.000Z',
        ends_at: '2025-01-01T13:00:00.000Z',
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({ // Created pools query
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [mockCreatedPool] }),
      }).mockReturnValueOnce({ // Member pools query
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [] }),
      });

      const result = await getActivePool(mockUserId);
      expect(result).toEqual(mockCreatedPool);
    });

    it('should return a pool if the user is a member', async () => {
      // Mock Member Pools Response
      const mockMemberPool = {
        id: 'pool-2',
        creator_id: 'other-user',
        title: 'Joined Pool',
        status: 'active',
        created_at: '2025-01-01T11:30:00.000Z',
        ends_at: '2025-01-01T13:30:00.000Z',
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({ // Created pools query
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [] }),
      }).mockReturnValueOnce({ // Member pools query (pool_members)
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ 
          data: [{ pool_id: 'pool-2', pools: mockMemberPool }] 
        }),
      });

      const result = await getActivePool(mockUserId);
      expect(result).toEqual(mockMemberPool);
    });

    it('should return null if user neither created nor joined any active pool', async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({ // Created pools
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [] }),
      }).mockReturnValueOnce({ // Member pools
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [] }),
      });

      const result = await getActivePool(mockUserId);
      expect(result).toBeNull();
    });

    it('should prioritize the most recently created pool if both exist', async () => {
      const mockCreatedPool = {
        id: 'pool-1',
        created_at: '2025-01-01T10:00:00.000Z',
        status: 'active',
        ends_at: '2025-01-01T14:00:00.000Z',
      };
      
      const mockMemberPool = {
        id: 'pool-2',
        created_at: '2025-01-01T11:00:00.000Z', // Newer
        status: 'active',
        ends_at: '2025-01-01T14:00:00.000Z',
      };

      (supabase.from as jest.Mock).mockReturnValueOnce({ 
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [mockCreatedPool] }),
      }).mockReturnValueOnce({ 
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ 
          data: [{ pool_id: 'pool-2', pools: mockMemberPool }] 
        }),
      });

      const result = await getActivePool(mockUserId);
      expect(result).toEqual(mockMemberPool); // Should be pool-2 because it's newer
    });
  });

  describe('joinPoolMember', () => {
    it('should add user to pool_members if not already a member', async () => {
      const mockPoolId = 'pool-123';
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: { id: mockUserId } } });
      
      // Mock existence check (returns null)
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null }),
      });

      // Mock insert
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      (supabase.from as jest.Mock).mockReturnValueOnce({
        insert: mockInsert
      });

      await joinPoolMember(mockPoolId);
      
      expect(mockInsert).toHaveBeenCalledWith({
        pool_id: mockPoolId,
        user_id: mockUserId
      });
    });

    it('should not insert if user is already a member', async () => {
      const mockPoolId = 'pool-123';
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: { id: mockUserId } } });
      
      // Mock existence check (returns existing record)
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'existing-id' } }),
      });

      await joinPoolMember(mockPoolId);
      
      // Verify insert was NOT called
      expect(supabase.from).toHaveBeenCalledTimes(1); // Only the select
    });
  });
});
