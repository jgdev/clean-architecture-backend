import User from "@/core/entities/User";
import SessionService from "@/core/services/auth/SessionService";

export type GetUserBySessionDTO = {
  sessionId: string;
};

export type GetUserBySessionResultDTO = {
  user: User;
};

export default class GetUserBySessionUseCase {
  private sessionService: SessionService;

  constructor(deps: { sessionService: SessionService }) {
    this.sessionService = deps.sessionService;
  }

  async execute(
    params: GetUserBySessionDTO
  ): Promise<GetUserBySessionResultDTO> {
    const user = await this.sessionService.getUserBySessionId(params.sessionId);
    return { user };
  }
}
