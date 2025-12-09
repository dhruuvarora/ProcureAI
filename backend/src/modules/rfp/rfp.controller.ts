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
  async getRfps(req: Request, res: Response) {
    try {
      const data = await RfpService.getRfps();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  }

  async getRfpById(req: Request, res: Response) {
    const id = req.params.id;

    const rfp = await RfpService.getRfpById(id);

    return res.status(200).json({
      success: true,
      data: rfp,
    });
  }

  async updateRfp(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const payload = req.body;

      const updateRfp = await RfpService.updateRfp(id, payload);

      return res.status(200).json({
        success: true,
        message: "RFP updated successfully",
        data: updateRfp,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
  
  async deleteRfp(req: Request, res: Response) {
    const id = req.params.id;

    const deletedRfp = await RfpService.deleteRfp(id);

    return res.status(200).json({
      success: true,
      message: "RFP deleted successfully",
      data: deletedRfp,
    });
  }
}

export default new RfpController();
