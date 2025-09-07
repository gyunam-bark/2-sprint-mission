import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';
import { CommentsModule } from './comments/comments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticesModule } from './notices/notices.module';
import { Repository } from 'typeorm';
import { User, UserRole } from './users/user.entity';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    ResourcesModule,
    CommentsModule,
    NoticesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = 'admin';
    const adminPassword = 'passwordadmin';

    const exists = await this.userRepo.findOne({
      where: { email: adminEmail },
    });
    if (!exists) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      const admin = this.userRepo.create({
        email: adminEmail,
        password: hashed,
        role: UserRole.ADMIN,
      });
      await this.userRepo.save(admin);
      console.log('Admin account created: admin / passwordadmin');
    } else {
      console.log('Admin account already exists');
    }
  }
}
