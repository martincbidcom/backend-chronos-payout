import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BindModule } from './bind/bind.module';

@Module({
  imports: [
    BindModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
