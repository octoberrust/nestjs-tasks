import { Injectable, NotFoundException, Inject } from '@nestjs/common';
//import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { filter } from 'minimatch';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  @InjectRepository(TaskRepository)
  private taskRepository: TaskRepository;

  async getTaskById(id: number, user: User): Promise<Task> {
    //const found = await this.taskRepository.findOne(id);
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`task with id ${id} not found`);
    }

    return found;
  }

  public async createTask(createTask: CreateTaskDto, user: User) {
    return this.taskRepository.createTask(createTask, user);
  }

  public async deleteTask(id: number, user: User) {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    console.info(result);
    if (result.affected === 0) {
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  public async updateTask(id: number, status: TaskStatus, user: User) {
    const oldTask = await this.getTaskById(id, user);
    oldTask.status = status;
    await oldTask.save();
    return oldTask;
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }
  //  private tasks: Task[] = [];

  // public getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // public createTask(title: string, description: string): Task {
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // public createTask(createTask: CreateTaskDto): Task {
  //   const { title, description } = createTask;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   console.info(task);
  //   this.tasks.push(task);
  //   return task;
  // }
  // public getTaskById(id: string): Task {
  //   const found = this.tasks.find(task => task.id === id);
  //   if(!found){
  //     throw new NotFoundException(`task with id ${id} not found`);
  //   }

  //   return found;
  // }
  // public deleteById(id: string): void {
  //   console.info(this.tasks);
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter(val => val.id !== id);
  //   console.info(this.tasks);
  // }

  // public updateTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  // getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }
}
