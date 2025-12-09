import { Request, Response } from "express";
import RfpService from "./rfp.service";

export class RfpController {
  async createRfp(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        budget,
        delivery_time,
        attachment_path,
        structured_json,
      } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      const payload = {
        title,
        description,
        budget,
        delivery_time,
        attachment_path,
        structured_json,
      };

      const newRfp = await RfpService.createRfp(payload);

      return res.status(201).json({
        success: true,
        message: "RFP created successfully",
        data: newRfp,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  }
}

export default new RfpController();
