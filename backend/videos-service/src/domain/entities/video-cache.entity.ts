import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('video_cache')
export class VideoCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })  // Regular column
  videoId: string;

  @Column('jsonb', { nullable: false })
  data: any;

  @Column({ nullable: false })
  query: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  cachedAt: Date;
}