import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor() {}
  getDescription(): string {
    return "Nestjs API created by @Shekcon";
  }
}
