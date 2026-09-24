import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import { Request } from 'express'

import { FirebaseAuthGuard } from '../firebase/firebaseAuth.guard'
import { classTransformValidate } from '../utils'
import { BankAccountCreateDTO, BankAccountFindManyDTO, BankAccountUpdateDTO } from './bankAccount.model'
import { BankAccountService } from './bankAccount.service'

@Controller('api/v1/bank-account')
export class BankAccountController {
  private readonly logger: Logger

  constructor(private bankAccountService: BankAccountService) {
    this.logger = new Logger(BankAccountController.name)
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(@Body() body: BankAccountCreateDTO, @Req() req: Request) {
    const bankAccount = await this.bankAccountService.create({
      ...body,
      userId: req.user!.id,
    })
    return this.bankAccountService.formatBankAccount(bankAccount)
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async delete(@Param('id') id: string, @Req() req: Request) {
    if (!id) {
      throw new BadRequestException('Bank account ID is required')
    }
    return this.bankAccountService.delete({ id, userId: req.user!.id })
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async get(@Param('id') id: string, @Req() req: Request) {
    if (!id) {
      throw new BadRequestException('Bank account ID is required')
    }
    const bankAccount = await this.bankAccountService.get({ id, userId: req.user!.id })
    if (!bankAccount) {
      throw new NotFoundException('Bank account not found')
    }
    return this.bankAccountService.formatBankAccount(bankAccount)
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async findMany(@Query() query: Record<string, string>, @Req() req: Request) {
    const validatedQuery = await classTransformValidate<BankAccountFindManyDTO>(BankAccountFindManyDTO, query)
    const bankAccounts = await this.bankAccountService.findMany({
      ...validatedQuery,
      userId: req.user!.id,
    })
    return bankAccounts.map((bankAccount) => this.bankAccountService.formatBankAccount(bankAccount))
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  async update(@Param('id') id: string, @Body() body: BankAccountUpdateDTO, @Req() req: Request) {
    if (!id) {
      throw new BadRequestException('Bank account ID is required')
    }

    const existingBankAccount = await this.bankAccountService.get({ id, userId: req.user!.id })
    if (!existingBankAccount) {
      throw new NotFoundException('Bank account not found')
    }

    const updatedBankAccount = await this.bankAccountService.update({
      data: body,
      id,
      userId: req.user!.id,
    })

    return this.bankAccountService.formatBankAccount(updatedBankAccount)
  }
}
