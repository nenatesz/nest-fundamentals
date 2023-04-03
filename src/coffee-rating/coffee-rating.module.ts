import { Module } from '@nestjs/common';
import { CoffeeModule } from 'src/coffee/coffee.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  imports: [CoffeeModule],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
