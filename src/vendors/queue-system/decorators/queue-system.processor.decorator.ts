import { SetMetadata } from '@nestjs/common';

import { IQueueSystemProcessorOptions } from '../interfaces/queue-system.processor.options.interface';
import { QUEUE_SYSTEM_PROCESSOR_METADATA_KEY } from '../queue-system.constants';

export function QueueSystemProcessor(queueName: string): ClassDecorator;
export function QueueSystemProcessor(processorOptions: IQueueSystemProcessorOptions): ClassDecorator;
export function QueueSystemProcessor(queueNameOrOptions?: string | IQueueSystemProcessorOptions): ClassDecorator {
  const options: IQueueSystemProcessorOptions =
    queueNameOrOptions && typeof queueNameOrOptions === 'object'
      ? queueNameOrOptions
      : { name: queueNameOrOptions as string };

  return (target) => {
    SetMetadata(QUEUE_SYSTEM_PROCESSOR_METADATA_KEY, options)(target);
  };
}
