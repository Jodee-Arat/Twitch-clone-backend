import { PrismaService } from "@/src/core/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { LivekitService } from "../../libs/livekit/livekit.service";
import { type User } from "@/prisma/generated";
import {
  CreateIngressOptions,
  IngressAudioEncodingPreset,
  IngressInput,
  IngressVideoEncodingPreset,
} from "livekit-server-sdk";

@Injectable()
export class IngressService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly liveKitService: LivekitService
  ) {}

  async create(user: User, ingressType: IngressInput) {
    await this.resetIngresses(user);
    const options: CreateIngressOptions = {
      name: user.username,
      roomName: user.id,
      participantName: user.username,
      participantIdentity: user.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
      options.bypassTranscoding = true;
    } else {
      options.video = {
        source: 1,
        preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
      };
      options.audio = {
        source: 2,
        preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
      };
    }

    const ingress = await this.liveKitService.ingress.createIngress(
      ingressType,
      options
    );

    if (!ingress || !ingress.url || !ingress.streamKey) {
      throw new BadRequestException("Не удалось создать входной поток");
    }

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey,
      },
    });
    return true;
  }
  private async resetIngresses(user: User) {
    const ingresses = await this.liveKitService.ingress.listIngress({
      roomName: user.id,
    });

    const rooms = await this.liveKitService.room.listRooms([user.id]);
    for (const room of rooms) {
      await this.liveKitService.room.deleteRoom(room.name);
    }
    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        await this.liveKitService.ingress.deleteIngress(ingress.ingressId);
      }
    }
  }
  // Полностью очищает LiveKit-сессию пользователя: удаляет все комнаты и все связанные с ними ingress-потоки, основываясь на user.id.
}
