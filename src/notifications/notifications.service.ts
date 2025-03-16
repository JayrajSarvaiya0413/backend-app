import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsService {
  private notificationSubjects: Map<string, Subject<Notification>> = new Map();

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.is_read = true;
    return this.notificationRepository.save(notification);
  }

  async createNotification(
    userId: string,
    message: string,
    type: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user_id: userId,
      message,
      type,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);

    // Emit the notification to the user's SSE stream
    this.emitNotification(userId, savedNotification);

    return savedNotification;
  }

  // SSE methods
  getNotificationSubject(userId: string): Subject<Notification> {
    if (!this.notificationSubjects.has(userId)) {
      this.notificationSubjects.set(userId, new Subject<Notification>());
    }
    return this.notificationSubjects.get(userId);
  }

  emitNotification(userId: string, notification: Notification): void {
    const subject = this.getNotificationSubject(userId);
    subject.next(notification);
  }
}
