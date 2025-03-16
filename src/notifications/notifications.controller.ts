import { Controller, Get, Post, Param, Body, Sse, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.notificationsService.findByUserId(userId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post()
  async createNotification(
    @Body() body: { user_id: string; message: string; type: string },
  ) {
    return this.notificationsService.createNotification(
      body.user_id,
      body.message,
      body.type,
    );
  }

  @Sse('sse/:userId')
  sse(@Param('userId') userId: string): Observable<MessageEvent> {
    return this.notificationsService.getNotificationSubject(userId).pipe(
      map(
        (notification) =>
          ({
            data: {
              id: notification.id,
              message: notification.message,
              type: notification.type,
              created_at: notification.created_at,
            },
          }) as MessageEvent,
      ),
    );
  }
}
