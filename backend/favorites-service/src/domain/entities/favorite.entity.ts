import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('favorites')
@Index(['userId', 'videoId'], { unique: true })
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  videoId: string;

  @Column('json')
  videoData: {
    title: string;
    description: string;
    thumbnailUrl: string;
    channelTitle: string;
  };

  @CreateDateColumn()
  createdAt: Date;
}