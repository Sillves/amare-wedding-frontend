import type { components } from '@/types/api';

export type InvitationFlowDto = components['schemas']['InvitationFlowDto'];
export type CreateInvitationFlowRequest = components['schemas']['CreateInvitationFlowRequestDto'];
export type UpdateInvitationFlowRequest = components['schemas']['UpdateInvitationFlowRequestDto'];
export type QuestionDefinition = components['schemas']['QuestionDefinition'];
export type CustomEventDefinition = components['schemas']['CustomEventDefinition'];
export type RsvpQuestionType = components['schemas']['RsvpQuestionType'];

export type RsvpFlowState = components['schemas']['RsvpFlowStateDto'];
export type RsvpFlowPublic = components['schemas']['RsvpFlowPublicDto'];
export type RsvpEventOption = components['schemas']['RsvpEventOptionDto'];
export type RsvpFlowSubmitRequest = components['schemas']['RsvpFlowSubmitRequestDto'];
export type RsvpSubmitResult = components['schemas']['RsvpSubmitResultDto'];
export type RsvpResponseDto = components['schemas']['RsvpResponseDto'];
export type RsvpResponseStatus = components['schemas']['RsvpResponseStatus'];

export const QUESTION_TYPES: RsvpQuestionType[] = ['YesNo', 'FreeText', 'SingleChoice', 'MultiChoice'];
