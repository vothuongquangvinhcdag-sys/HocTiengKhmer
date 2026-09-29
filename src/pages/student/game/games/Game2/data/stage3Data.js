import { stage1Data } from "./stage1Data";

/* =========================================================
   GAME 2 — STAGE 3 DATA

   CHỮ KHMER ĐÃ GHÉP
        ↓
   CHỌN PHIÊN ÂM

   Đồng bộ trực tiếp từ stage1Data
   để Stage 1 và Stage 3 luôn dùng
   cùng một ngân hàng kiến thức.
========================================================= */

export const stage3Data = stage1Data.map(
  ({
    id,
    combined,
    roman,
  }) => ({
    id,
    combined,
    roman,
  })
);