import { Request, Response } from "express";
export declare const startWorkout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const endWorkout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getWorkoutHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getWorkoutStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteWorkout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTodayProgress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=workout.controller.d.ts.map