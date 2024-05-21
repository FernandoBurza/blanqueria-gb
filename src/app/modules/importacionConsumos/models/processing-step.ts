export interface ProcessingStep {
  id: number;
  percentage: number;
  isProcessingCompleted: boolean;
  processingTime: string;
  hasFailed: boolean;
}
