import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationApi } from '../api/invitationApi';
import type { CreateWeddingInvitationRequest, UpdateWeddingUserRequest } from '../types';

export function useWeddingInvitations(weddingId: string) {
  return useQuery({
    queryKey: ['invitations', weddingId],
    queryFn: () => invitationApi.getAll(weddingId),
    enabled: !!weddingId,
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weddingId, data }: { weddingId: string; data: CreateWeddingInvitationRequest }) =>
      invitationApi.create(weddingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.weddingId] });
    },
  });
}

export function useCancelInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weddingId, invitationId }: { weddingId: string; invitationId: string }) =>
      invitationApi.cancel(weddingId, invitationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.weddingId] });
    },
  });
}

export function useInvitationByToken(token: string) {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => invitationApi.getByToken(token),
    enabled: !!token,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => invitationApi.accept(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
    },
  });
}

export function useWeddingUsers(weddingId: string) {
  return useQuery({
    queryKey: ['weddingUsers', weddingId],
    queryFn: () => invitationApi.getWeddingUsers(weddingId),
    enabled: !!weddingId,
  });
}

export function useRemoveWeddingUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weddingId, userId }: { weddingId: string; userId: string }) =>
      invitationApi.removeUser(weddingId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weddingUsers', variables.weddingId] });
    },
  });
}

export function useUpdateWeddingUserPermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weddingId, userId, data }: {
      weddingId: string; userId: string; data: UpdateWeddingUserRequest;
    }) => invitationApi.updateUserPermissions(weddingId, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weddingUsers', variables.weddingId] });
    },
  });
}
