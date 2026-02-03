import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}
  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
      data: {
        ...createBoardDto,
      },
    });
  }

  async findAll(): Promise<Board[]> {
    return this.prisma.board.findMany();
  }

  async findOne(id: string): Promise<Board | null> {
    return this.prisma.board.findUnique({
      where: { id: String(id) },
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    return this.prisma.board.update({
      where: { id: String(id) },
      data: {
        ...updateBoardDto,
      },
    });
  }

  async remove(id: string): Promise<Board> {
    return this.prisma.board.delete({
      where: { id: String(id) },
    });
  }
}
