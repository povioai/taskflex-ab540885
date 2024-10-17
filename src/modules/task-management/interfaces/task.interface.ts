export interface ITask {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
