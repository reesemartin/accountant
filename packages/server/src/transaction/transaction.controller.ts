import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import dayjs from 'dayjs'
import { Request } from 'express'

import { JwtAuthGuard } from './../auth/jwtAuth.guard'
import { classTransformValidate } from './../utils'
import { TransactionCreateDTO, TransactionFindManyDTO, TransactionUpdateDTO } from './transaction.model'
import { TransactionService } from './transaction.service'

@Controller('api/v1/transaction')
export class TransactionController {
  private readonly logger: Logger

  constructor(private transactionService: TransactionService) {
    this.logger = new Logger(TransactionController.name)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: TransactionCreateDTO, @Req() req: Request) {
    return this.transactionService.create({
      ...body,
      userId: req.user.id,
    })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req() req: Request) {
    if (!id) {
      throw new BadRequestException('Transaction ID is required')
    }
    return this.transactionService.delete({ id: Number(id), userId: req.user.id })
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Transaction ID is required')
    }
    return this.transactionService.get({ id: Number(id) })
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findMany(@Query() query: Record<string, string>, @Req() req: Request) {
    const validatedQuery = await classTransformValidate<TransactionFindManyDTO>(TransactionFindManyDTO, query)
    return this.transactionService.findMany({
      ...validatedQuery,
      end: validatedQuery.end ? dayjs(validatedQuery.end).toDate() : undefined,
      start: validatedQuery.start ? dayjs(validatedQuery.start).toDate() : undefined,
      userId: req.user.id,
    })
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: TransactionUpdateDTO, @Req() req: Request) {
    if (!id) {
      throw new BadRequestException('Transaction ID is required')
    }
    return this.transactionService.update({
      data: body,
      id: Number(id),
      userId: req.user.id,
    })
  }
}
