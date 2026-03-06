import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '@/auth/optional-jwt-auth.guard';
import type { UserResponseDto } from '@/user/dto/user-response.dto';

import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardsQueryDto } from './dto/get-boards-query.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Query() queryDto: GetBoardsQueryDto, @CurrentUser() user?: UserResponseDto) {
    return this.boardService.findAll(queryDto, user?.id);
  }

  @Get(':id')
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user?: UserResponseDto) {
    return this.boardService.findOne(id, user?.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }

  @Post(':id/subscribe')
  @HttpCode(HttpStatus.CREATED)
  subscribe(@Param('id') boardId: string, @CurrentUser() user: UserResponseDto) {
    return this.boardService.subscribe(user.id, boardId);
  }

  @Delete(':id/subscribe')
  @HttpCode(HttpStatus.NO_CONTENT)
  unsubscribe(@Param('id') boardId: string, @CurrentUser() user: UserResponseDto) {
    return this.boardService.unsubscribe(user.id, boardId);
  }
}
