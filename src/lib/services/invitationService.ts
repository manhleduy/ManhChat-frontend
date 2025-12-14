import { api } from "../axios";

export const sendInvitation = async (
    data: { receiverId: string; content: string; senderId: string },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.post('/api/invitation/create', data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const getAllInvitation = async (
    id: string,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.get(`/api/invitation/${id}`);
        setLoading(false);
        return res.data.invitations;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const sendGroupProposal = async (
    data: { userId: string; adminId: string; content: string; groupId: string },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.post('/api/invitation/proposal/create', data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const sendJoinGroupInvitation = async (
    data: { adminId: string; content: string; groupId: string; receiverId: string },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.post('/api/invitation/group/create', data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const getAllGroupProposal = async (
    id: string,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.get(`/api/invitation/group/proposal/${id}`);
        setLoading(false);
        return res.data.invitations;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const deleteInvitation = async (
    id: string,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.delete(`/api/invitation/${id}`);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};