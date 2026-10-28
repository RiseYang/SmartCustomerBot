/*
 Navicat Premium Dump SQL

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80036 (8.0.36)
 Source Host           : localhost:3306
 Source Schema         : scb_db

 Target Server Type    : MySQL
 Target Server Version : 80036 (8.0.36)
 File Encoding         : 65001

 Date: 14/10/2026 20:00:00
*/

CREATE DATABASE IF NOT EXISTS `scb_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `scb_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sc_admin_user
-- ----------------------------
DROP TABLE IF EXISTS `sc_admin_user`;
CREATE TABLE `sc_admin_user`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1=启用，0=禁用',
  `last_login_at` datetime NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_admin_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '后台管理员账户' ROW_FORMAT = Dynamic;

INSERT INTO `sc_admin_user` VALUES (1, 'admin', '$2a$10$.a28KBLWxjVJP1Ub6OIxe.Z1k6I8UOhAMIHiNIENFxFq3MARri6WG', '管理员', 1, '2026-10-06 14:54:27', '2026-10-05 16:05:41', '2026-10-05 18:07:26');

-- ----------------------------
-- Table structure for sc_agent
-- ----------------------------
DROP TABLE IF EXISTS `sc_agent`;
CREATE TABLE `sc_agent`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'offline' COMMENT 'online|busy|offline',
  `max_concurrent` tinyint UNSIGNED NOT NULL DEFAULT 5,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '人工客服账号' ROW_FORMAT = Dynamic;

INSERT INTO `sc_agent` VALUES (1, 'agent01', '客服小王', 'online', 5, '2026-10-04 13:42:55', '2026-10-14 10:00:00');

-- ----------------------------
-- Table structure for sc_user
-- ----------------------------
DROP TABLE IF EXISTS `sc_user`;
CREATE TABLE `sc_user`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `openid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '微信 openid',
  `union_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '微信 unionid',
  `nick_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '昵称',
  `avatar_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '头像 URL',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '手机号',
  `registered` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否完善资料 0否 1是',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '1正常 0禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_openid`(`openid` ASC) USING BTREE,
  INDEX `idx_phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '小程序用户' ROW_FORMAT = Dynamic;

INSERT INTO `sc_user` VALUES (1, 'mock_openid_001', NULL, '微信用户', 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', '13800000000', 1, 1, '2026-10-04 13:42:55', '2026-10-04 13:42:55', 0);

-- ----------------------------
-- Table structure for sc_order
-- ----------------------------
DROP TABLE IF EXISTS `sc_order`;
CREATE TABLE `sc_order`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号 ORDxxx',
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品摘要/主标题',
  `amount` decimal(10, 2) NOT NULL DEFAULT 0.00,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'pending|paid|shipped|completed|cancelled',
  `status_text` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '展示文案：已发货等',
  `paid_at` datetime NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_user_created`(`user_id` ASC, `created_at` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `sc_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单' ROW_FORMAT = Dynamic;

INSERT INTO `sc_order` VALUES (1, 'ORD20250928001', 1, '智能手环 Pro', 299.00, 'shipped', '已发货', '2025-09-25 10:25:00', '2025-09-25 10:20:00', '2026-10-04 13:42:55');
INSERT INTO `sc_order` VALUES (2, 'ORD20250915002', 1, '无线耳机', 159.00, 'completed', '已完成', '2025-09-15 14:05:00', '2025-09-15 14:00:00', '2026-10-04 13:42:55');

-- ----------------------------
-- Table structure for sc_logistics
-- ----------------------------
DROP TABLE IF EXISTS `sc_logistics`;
CREATE TABLE `sc_logistics`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint UNSIGNED NOT NULL,
  `company` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '快递公司',
  `tracking_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '运单号',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'in_transit' COMMENT 'pending|in_transit|delivered',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_id`(`order_id` ASC) USING BTREE,
  INDEX `idx_tracking_no`(`tracking_no` ASC) USING BTREE,
  CONSTRAINT `fk_logistics_order` FOREIGN KEY (`order_id`) REFERENCES `sc_order` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '物流主表' ROW_FORMAT = Dynamic;

INSERT INTO `sc_logistics` VALUES (1, 1, '顺丰速运', 'SF1234567890', 'in_transit', '2026-10-04 13:42:55', '2026-10-04 13:42:55');

-- ----------------------------
-- Table structure for sc_logistics_trace
-- ----------------------------
DROP TABLE IF EXISTS `sc_logistics_trace`;
CREATE TABLE `sc_logistics_trace`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `logistics_id` bigint UNSIGNED NOT NULL,
  `trace_time` datetime NOT NULL,
  `description` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '越大越新，便于排序',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_logistics_sort`(`logistics_id` ASC, `sort_order` DESC) USING BTREE,
  CONSTRAINT `fk_trace_logistics` FOREIGN KEY (`logistics_id`) REFERENCES `sc_logistics` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '物流轨迹节点' ROW_FORMAT = Dynamic;

INSERT INTO `sc_logistics_trace` VALUES (1, 1, '2025-09-28 09:00:00', '快件已到达【北京朝阳集散中心】', 30);
INSERT INTO `sc_logistics_trace` VALUES (2, 1, '2025-09-27 18:30:00', '快件已从【上海转运中心】发出', 20);
INSERT INTO `sc_logistics_trace` VALUES (3, 1, '2025-09-26 12:00:00', '商家已发货', 10);

-- ----------------------------
-- Table structure for sc_invoice_apply
-- ----------------------------
DROP TABLE IF EXISTS `sc_invoice_apply`;
CREATE TABLE `sc_invoice_apply`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `apply_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'INVxxx',
  `order_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `invoice_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '电子普通发票' COMMENT '电子普通发票|增值税专用发票',
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发票抬头',
  `tax_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '税号',
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '接收邮箱',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'pending|processing|issued|rejected',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_apply_no`(`apply_no` ASC) USING BTREE,
  INDEX `idx_order_id`(`order_id` ASC) USING BTREE,
  INDEX `idx_user_status`(`user_id` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `fk_invoice_order` FOREIGN KEY (`order_id`) REFERENCES `sc_order` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_invoice_user` FOREIGN KEY (`user_id`) REFERENCES `sc_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '发票申请' ROW_FORMAT = Dynamic;

INSERT INTO `sc_invoice_apply` VALUES (1, 'INV20251001001', 2, 1, '电子普通发票', '北京智客科技有限公司', '91110000MA01234567', 'finance@example.com', 'issued', '模板数据：无线耳机订单已开具电子发票', '2026-10-01 11:20:00', '2026-10-03 09:00:00');

-- ----------------------------
-- Table structure for sc_return_request
-- ----------------------------
DROP TABLE IF EXISTS `sc_return_request`;
CREATE TABLE `sc_return_request`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'RMAxxx',
  `order_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'return' COMMENT 'return|exchange',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'pending|approved|rejected|completed',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_return_ticket_no`(`ticket_no` ASC) USING BTREE,
  INDEX `idx_order_id`(`order_id` ASC) USING BTREE,
  INDEX `idx_user_status`(`user_id` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `fk_return_order` FOREIGN KEY (`order_id`) REFERENCES `sc_order` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_return_user` FOREIGN KEY (`user_id`) REFERENCES `sc_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '退换货申请' ROW_FORMAT = Dynamic;

INSERT INTO `sc_return_request` VALUES (1, 'RMA20251002001', 1, 1, 'return', '智能手环无法正常充电，申请退货退款', 'pending', '2026-10-02 16:40:00', '2026-10-02 16:40:00');

-- ----------------------------
-- Table structure for sc_return_image
-- ----------------------------
DROP TABLE IF EXISTS `sc_return_image`;
CREATE TABLE `sc_return_image`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `return_request_id` bigint UNSIGNED NOT NULL,
  `url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '对象存储 URL',
  `sort_order` tinyint NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_return_id`(`return_request_id` ASC) USING BTREE,
  CONSTRAINT `fk_return_image_request` FOREIGN KEY (`return_request_id`) REFERENCES `sc_return_request` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '退换货凭证图片' ROW_FORMAT = Dynamic;

INSERT INTO `sc_return_image` VALUES (1, 1, 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', 0, '2026-10-02 16:40:00');

-- ----------------------------
-- Table structure for sc_chat_session
-- ----------------------------
DROP TABLE IF EXISTS `sc_chat_session`;
CREATE TABLE `sc_chat_session`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '对外 sessionId，如 sess_xxx',
  `user_id` bigint UNSIGNED NOT NULL,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'active|closed|handoff',
  `context_json` json NULL COMMENT 'failCount、lastIntent 等上下文',
  `channel` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'miniprogram',
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` datetime NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_session_no`(`session_no` ASC) USING BTREE,
  INDEX `idx_user_status`(`user_id` ASC, `status` ASC) USING BTREE,
  CONSTRAINT `fk_chat_session_user` FOREIGN KEY (`user_id`) REFERENCES `sc_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '客服聊天会话' ROW_FORMAT = Dynamic;

INSERT INTO `sc_chat_session` VALUES (1, 'sess_demo_001', 1, 'closed', '{\"failCount\": 0, \"lastIntent\": \"order_query\"}', 'miniprogram', '2026-10-10 10:00:00', '2026-10-10 10:08:00', '2026-10-10 10:00:00', '2026-10-10 10:08:00');
INSERT INTO `sc_chat_session` VALUES (2, 'sess_demo_002', 1, 'handoff', '{\"failCount\": 0, \"lastIntent\": \"human\"}', 'miniprogram', '2026-10-14 09:30:00', NULL, '2026-10-14 09:30:00', '2026-10-14 09:32:00');

-- ----------------------------
-- Table structure for sc_chat_message
-- ----------------------------
DROP TABLE IF EXISTS `sc_chat_message`;
CREATE TABLE `sc_chat_message`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` bigint UNSIGNED NOT NULL,
  `role` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'user|assistant|system|agent',
  `msg_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'text|image|video|card|buttons|form|file|system',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '纯文本摘要，便于检索',
  `payload_json` json NOT NULL COMMENT '完整消息体，与小程序 message-item 一致',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_session_created`(`session_id` ASC, `created_at` ASC) USING BTREE,
  CONSTRAINT `fk_chat_message_session` FOREIGN KEY (`session_id`) REFERENCES `sc_chat_session` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会话消息' ROW_FORMAT = Dynamic;

INSERT INTO `sc_chat_message` VALUES (1, 1, 'user', 'text', '我想查一下订单 ORD20250928001', '{\"type\": \"text\", \"content\": \"我想查一下订单 ORD20250928001\"}', '2026-10-10 10:01:00');
INSERT INTO `sc_chat_message` VALUES (2, 1, 'assistant', 'text', '已为您打开订单查询。您也可以直接告诉我订单号。', '{\"type\": \"text\", \"content\": \"已为您打开订单查询。您也可以直接告诉我订单号。\"}', '2026-10-10 10:01:05');
INSERT INTO `sc_chat_message` VALUES (3, 1, 'assistant', 'buttons', '去查订单', '{\"type\": \"buttons\", \"buttons\": [{\"label\": \"去查订单\", \"action\": \"nav:/pages/order/order\"}]}', '2026-10-10 10:01:06');
INSERT INTO `sc_chat_message` VALUES (4, 1, 'system', 'system', '会话已结束', '{\"type\": \"system\", \"content\": \"会话已结束\"}', '2026-10-10 10:08:00');
INSERT INTO `sc_chat_message` VALUES (5, 2, 'user', 'text', '转人工', '{\"type\": \"text\", \"content\": \"转人工\"}', '2026-10-14 09:31:00');
INSERT INTO `sc_chat_message` VALUES (6, 2, 'system', 'system', '正在为您转接人工客服，请稍候…', '{\"type\": \"system\", \"content\": \"正在为您转接人工客服，请稍候…\"}', '2026-10-14 09:31:02');
INSERT INTO `sc_chat_message` VALUES (7, 2, 'assistant', 'text', '已接入人工队列，约 2 分钟。工单号：HD20261014001', '{\"type\": \"text\", \"content\": \"已接入人工队列，约 2 分钟。工单号：HD20261014001\"}', '2026-10-14 09:32:00');

-- ----------------------------
-- Table structure for sc_chat_intent_log
-- ----------------------------
DROP TABLE IF EXISTS `sc_chat_intent_log`;
CREATE TABLE `sc_chat_intent_log`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` bigint UNSIGNED NOT NULL,
  `message_id` bigint UNSIGNED NULL DEFAULT NULL,
  `intent` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'order_query|logistics|invoice|return|human|greet|unknown|clarify',
  `confidence` decimal(5, 4) NULL DEFAULT NULL,
  `user_text` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_session_intent`(`session_id` ASC, `created_at` ASC) USING BTREE,
  INDEX `fk_intent_message`(`message_id` ASC) USING BTREE,
  CONSTRAINT `fk_intent_message` FOREIGN KEY (`message_id`) REFERENCES `sc_chat_message` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_intent_session` FOREIGN KEY (`session_id`) REFERENCES `sc_chat_session` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '意图识别轨迹' ROW_FORMAT = Dynamic;

INSERT INTO `sc_chat_intent_log` VALUES (1, 1, 1, 'order_query', 0.9000, '我想查一下订单 ORD20250928001', '2026-10-10 10:01:01');
INSERT INTO `sc_chat_intent_log` VALUES (2, 2, 5, 'human', 0.9900, '转人工', '2026-10-14 09:31:01');

-- ----------------------------
-- Table structure for sc_handoff_ticket
-- ----------------------------
DROP TABLE IF EXISTS `sc_handoff_ticket`;
CREATE TABLE `sc_handoff_ticket`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '工单号 HDxxx',
  `session_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'queued' COMMENT 'queued|serving|closed',
  `queue_no` int UNSIGNED NULL DEFAULT NULL,
  `estimated_wait` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '如：约 2 分钟',
  `intent_summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `transcript_json` json NULL COMMENT '转人工时的对话快照',
  `agent_id` bigint UNSIGNED NULL DEFAULT NULL,
  `assigned_at` datetime NULL DEFAULT NULL,
  `closed_at` datetime NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_ticket_no`(`ticket_no` ASC) USING BTREE,
  INDEX `idx_session_id`(`session_id` ASC) USING BTREE,
  INDEX `idx_status_queue`(`status` ASC, `queue_no` ASC) USING BTREE,
  INDEX `fk_handoff_user`(`user_id` ASC) USING BTREE,
  INDEX `fk_handoff_agent`(`agent_id` ASC) USING BTREE,
  CONSTRAINT `fk_handoff_agent` FOREIGN KEY (`agent_id`) REFERENCES `sc_agent` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_handoff_session` FOREIGN KEY (`session_id`) REFERENCES `sc_chat_session` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_handoff_user` FOREIGN KEY (`user_id`) REFERENCES `sc_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '转人工工单' ROW_FORMAT = Dynamic;

INSERT INTO `sc_handoff_ticket` VALUES (1, 'HD20261014001', 2, 1, 'queued', 12, '约 2 分钟', '最近意图：human；末次表述：转人工', '[{\"role\": \"user\", \"content\": \"转人工\"}]', 1, NULL, NULL, '2026-10-14 09:32:00', '2026-10-14 09:32:00');

-- ----------------------------
-- Table structure for sc_satisfaction
-- ----------------------------
DROP TABLE IF EXISTS `sc_satisfaction`;
CREATE TABLE `sc_satisfaction`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` bigint UNSIGNED NULL DEFAULT NULL COMMENT '无会话时可为空（我的页单独评价）',
  `user_id` bigint UNSIGNED NOT NULL,
  `score` tinyint UNSIGNED NOT NULL COMMENT '1-5 星',
  `comment` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `tags_json` json NULL COMMENT '标签数组',
  `skipped` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_created`(`user_id` ASC, `created_at` ASC) USING BTREE,
  INDEX `idx_session_id`(`session_id` ASC) USING BTREE,
  CONSTRAINT `fk_satisfaction_session` FOREIGN KEY (`session_id`) REFERENCES `sc_chat_session` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_satisfaction_user` FOREIGN KEY (`user_id`) REFERENCES `sc_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '满意度评价' ROW_FORMAT = Dynamic;

INSERT INTO `sc_satisfaction` VALUES (1, 1, 1, 5, '查订单很快，解释清楚', '[\"响应及时\", \"解答专业\"]', 0, '2026-10-10 10:08:30');

-- ----------------------------
-- Table structure for sc_user_session
-- ----------------------------
DROP TABLE IF EXISTS `sc_user_session`;
CREATE TABLE `sc_user_session`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `token_hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'JWT/Token 哈希，不落明文',
  `expires_at` datetime NOT NULL,
  `client_ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_token_hash`(`token_hash` ASC) USING BTREE,
  CONSTRAINT `fk_user_session_user` FOREIGN KEY (`user_id`) REFERENCES `sc_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '登录 Token 会话' ROW_FORMAT = Dynamic;

INSERT INTO `sc_user_session` VALUES (1, 1, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '2026-12-31 23:59:59', '127.0.0.1', '2026-10-04 13:42:55');

SET FOREIGN_KEY_CHECKS = 1;
