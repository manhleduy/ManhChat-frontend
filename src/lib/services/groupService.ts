import { api } from "../axios";

export const createGroup = async (
    data: { detail: string; adminId: string; groupName: string; isRestricted: boolean },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.post('/api/group/create', data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const updateGroup = async (
    data: { detail: string; groupName: string; groupId: string; adminId: string; isRestricted: boolean },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.put('/api/group/update', data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const createGroupConnect = async (
    data: { groupId: string; adminId: string; memberId: string },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.post('/api/group/createconnect', data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const getGroupInfo = async (
    id: string,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.get(`/api/group/${id}`);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};