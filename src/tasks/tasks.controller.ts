import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
//import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('Task Controller');
  constructor(private taskService: TasksService) {}
  // @Get()
  // getAllTasks(): Task[] {
  //   return this.taskService.getAllTasks();
  // }
  //   @Post()
  //   craateTask(@Body() body) {
  //     console.log(body);
  //   }
  // @Post()
  // craateTask(
  //   @Body('title') title: string,
  //   @Body('description') description: string,
  // ) {
  //   return this.taskService.createTask(title, description);
  // }
  // @Post()
  // @UsePipes(ValidationPipe)
  // createTask(@Body() createTaskDto: CreateTaskDto) {
  //   console.info(createTaskDto);
  //   return this.taskService.createTask(createTaskDto);
  // }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createTask(@Body() createTaskDto: CreateTaskDto) {
  //   console.info(createTaskDto);
  //   return this.taskService.createTask(createTaskDto);
  // }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    this.logger.verbose(
      `User ${user.username} creates task with ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    console.info(id);
    return this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.taskService.deleteTask(id, user);
  }
  @Patch('/:id/status')
  UpdateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidation) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTask(id, status, user);
  }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ) {
    this.logger.verbose(
      `User ${user.username} retriving all tasks with filters ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string) {
  //   console.info(id);
  //   return this.taskService.getTaskById(id);
  // }

  // @Delete('/:id')
  // deleteById(@Param('id') id: string) {
  //   return this.taskService.deleteById(id);
  // }

  // @Patch('/:id/status')
  // UpdateTaskStatus(
  //   @Param('id') id: string,
  //   @Body('status', TaskStatusValidation) status: TaskStatus,
  // ) {
  //   return this.taskService.updateTask(id, status);
  // }

  // @Get()
  // getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
  //   console.info(filterDto);
  //   if (Object.keys(filterDto).length) {
  //     return this.taskService.getTaskWithFilters(filterDto);
  //   } else {
  //     return this.taskService.getAllTasks();
  //   }
  // }
}
