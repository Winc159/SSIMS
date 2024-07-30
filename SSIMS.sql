-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： db
-- 生成日期： 2024-07-28 09:45:11
-- 服务器版本： 9.0.1
-- PHP 版本： 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `SSIMS`
--

-- --------------------------------------------------------

--
-- 表的结构 `assenment_report`
--

CREATE TABLE `assenment_report` (
  `Report_id` int NOT NULL,
  `Type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `File_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `assenment_report`
--

INSERT INTO `assenment_report` (`Report_id`, `Type`, `File_path`) VALUES
(201, '认知', 'D:/assenment_report/2/1'),
(301, '语言', 'D:/assenment_report/3/1'),
(302, '认知', 'D:/assenment_report/3/2');

-- --------------------------------------------------------

--
-- 表的结构 `course`
--

CREATE TABLE `course` (
  `Course_ID` int NOT NULL,
  `Course_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Course_type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `course`
--

INSERT INTO `course` (`Course_ID`, `Course_name`, `Course_type`) VALUES
(1, '拼音课', '语言'),
(2, '篮球课', '肢体'),
(3, '识字课', '认知'),
(4, '音乐课', '认知');

-- --------------------------------------------------------

--
-- 表的结构 `institution`
--

CREATE TABLE `institution` (
  `Institution_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Institution_address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Contact` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Contact_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `institution`
--

INSERT INTO `institution` (`Institution_name`, `Institution_address`, `Contact`, `Contact_number`) VALUES
('向阳花康复机构', '重庆市南岸区南坪东路xx号', '周伊', '111-111-111'),
('爱心康复机构', '重庆市渝北区龙塔街道xx号', '周贰', '222-222-222');

-- --------------------------------------------------------

--
-- 表的结构 `project_type`
--

CREATE TABLE `project_type` (
  `Project_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Project_ownership` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `project_type`
--

INSERT INTO `project_type` (`Project_name`, `Project_ownership`) VALUES
('发育迟缓专项', '22区残联'),
('自闭症专项', '11区残联');

-- --------------------------------------------------------

--
-- 表的结构 `student`
--

CREATE TABLE `student` (
  `Student_ID` int NOT NULL,
  `Student_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `DOB` date NOT NULL,
  `Gender` enum('男','女') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Address_City` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Address_District` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Address_detail` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Parents_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Parents_Phonenumber` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Institution_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Project_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `student`
--

INSERT INTO `student` (`Student_ID`, `Student_name`, `DOB`, `Gender`, `Address_City`, `Address_District`, `Address_detail`, `Parents_name`, `Parents_Phonenumber`, `Institution_name`, `Project_name`) VALUES
(2, '王明', '2013-02-22', '男', '重庆', '渝中区', '民族路177号2-11-1', '王玛', '123123123', '向阳花康复机构', '自闭症专项'),
(3, '高聪', '2010-04-13', '男', '重庆', '渝北区', '文慧路17号1-12-2', '张三', '234234234', '向阳花康复机构', NULL),
(4, '季秋莲', '2015-01-11', '女', '成都', '锦江区', '资通桥正街12号1-12-1', '季明', '345345345', '向阳花康复机构', '发育迟缓专项'),
(5, '沐仁', '2009-12-11', '女', '重庆', '江北区', '建东一村12号11-2', '沐红花', '456456456', '爱心康复机构', '发育迟缓专项'),
(6, '白成辰', '2017-12-11', '男', '重庆', '江北区', '渝澳大道39号3-7-1', '白江', '567567567', '爱心康复机构', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `student_report`
--

CREATE TABLE `student_report` (
  `Student_ID` int NOT NULL,
  `Report_ID` int NOT NULL,
  `Report_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Report_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `student_report`
--

INSERT INTO `student_report` (`Student_ID`, `Report_ID`, `Report_name`, `Report_time`) VALUES
(2, 201, '王明-认知评估-2022/2/3', '2022-02-03 00:00:00'),
(3, 301, '高聪-语言评估-2022/4/22', '2022-04-22 00:00:00'),
(3, 302, '高聪-认知评估-2022/5/14', '2022-05-14 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `student_schedule`
--

CREATE TABLE `student_schedule` (
  `Student_ID` int NOT NULL,
  `Course_ID` int NOT NULL,
  `Course_room` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Course_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `student_schedule`
--

INSERT INTO `student_schedule` (`Student_ID`, `Course_ID`, `Course_room`, `Course_time`) VALUES
(2, 2, '103', '2024-07-12 10:00:00'),
(3, 2, '103', '2024-07-12 10:00:00'),
(4, 2, '103', '2024-07-12 10:00:00'),
(5, 1, '205', '2024-07-13 13:00:00'),
(5, 3, '205', '2024-07-13 15:00:00'),
(6, 4, '301', '2024-07-10 10:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `teacher`
--

CREATE TABLE `teacher` (
  `Teacher_ID` int NOT NULL,
  `Teacher_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `DOB` date NOT NULL,
  `Address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Phone_number` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Institution_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Gender` enum('男','女') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `teacher`
--

INSERT INTO `teacher` (`Teacher_ID`, `Teacher_name`, `DOB`, `Address`, `Phone_number`, `Institution_name`, `Gender`) VALUES
(1, '夏海华', '1999-08-30', '重庆市渝北区1街道2号1-22-1', '678678678', '爱心康复机构', '男'),
(2, '甘一禾', '2000-03-12', '重庆市渝北区2街道3号2-11-1', '789789789', '向阳花康复机构', '女'),
(3, '何琳茜', '2001-01-21', '重庆市江北区2街道33号1-16-1', '890890890', '爱心康复机构', '女'),
(4, '文健莹', '1990-09-12', '重庆市江北区4街道12号6-3-2', '901901901', '爱心康复机构', '女'),
(5, '梁厚丰', '1993-11-26', '重庆市南岸区5街道56号7-18-2', '901901901', '向阳花康复机构', '男');

-- --------------------------------------------------------

--
-- 表的结构 `teacher_schedule`
--

CREATE TABLE `teacher_schedule` (
  `Teacher_ID` int NOT NULL,
  `Course_ID` int NOT NULL,
  `Course_room` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Course_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `teacher_schedule`
--

INSERT INTO `teacher_schedule` (`Teacher_ID`, `Course_ID`, `Course_room`, `Course_time`) VALUES
(5, 2, '103', '2024-07-12 10:00:00'),
(4, 1, '205', '2024-07-13 13:00:00'),
(3, 3, '205', '2024-07-13 15:00:00'),
(1, 4, '301', '2024-07-10 10:00:00');

--
-- 转储表的索引
--

--
-- 表的索引 `assenment_report`
--
ALTER TABLE `assenment_report`
  ADD PRIMARY KEY (`Report_id`);

--
-- 表的索引 `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`Course_ID`);

--
-- 表的索引 `institution`
--
ALTER TABLE `institution`
  ADD PRIMARY KEY (`Institution_name`);

--
-- 表的索引 `project_type`
--
ALTER TABLE `project_type`
  ADD PRIMARY KEY (`Project_name`);

--
-- 表的索引 `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`Student_ID`),
  ADD KEY `Institution_name` (`Institution_name`),
  ADD KEY `Project_name` (`Project_name`);

--
-- 表的索引 `student_report`
--
ALTER TABLE `student_report`
  ADD KEY `Student_ID` (`Student_ID`),
  ADD KEY `Report_ID` (`Report_ID`);

--
-- 表的索引 `student_schedule`
--
ALTER TABLE `student_schedule`
  ADD KEY `Student_ID` (`Student_ID`),
  ADD KEY `Course_ID` (`Course_ID`);

--
-- 表的索引 `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`Teacher_ID`),
  ADD KEY `Institution_name` (`Institution_name`);

--
-- 表的索引 `teacher_schedule`
--
ALTER TABLE `teacher_schedule`
  ADD KEY `Teacher_ID` (`Teacher_ID`),
  ADD KEY `Course_ID` (`Course_ID`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `assenment_report`
--
ALTER TABLE `assenment_report`
  MODIFY `Report_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=303;

--
-- 使用表AUTO_INCREMENT `course`
--
ALTER TABLE `course`
  MODIFY `Course_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `student`
--
ALTER TABLE `student`
  MODIFY `Student_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用表AUTO_INCREMENT `teacher`
--
ALTER TABLE `teacher`
  MODIFY `Teacher_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 限制导出的表
--

--
-- 限制表 `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`Institution_name`) REFERENCES `institution` (`Institution_name`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`Project_name`) REFERENCES `project_type` (`Project_name`);

--
-- 限制表 `student_report`
--
ALTER TABLE `student_report`
  ADD CONSTRAINT `student_report_ibfk_1` FOREIGN KEY (`Student_ID`) REFERENCES `student` (`Student_ID`),
  ADD CONSTRAINT `student_report_ibfk_2` FOREIGN KEY (`Report_ID`) REFERENCES `assenment_report` (`Report_id`);

--
-- 限制表 `student_schedule`
--
ALTER TABLE `student_schedule`
  ADD CONSTRAINT `student_schedule_ibfk_1` FOREIGN KEY (`Student_ID`) REFERENCES `student` (`Student_ID`),
  ADD CONSTRAINT `student_schedule_ibfk_2` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`);

--
-- 限制表 `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`Institution_name`) REFERENCES `institution` (`Institution_name`);

--
-- 限制表 `teacher_schedule`
--
ALTER TABLE `teacher_schedule`
  ADD CONSTRAINT `teacher_schedule_ibfk_1` FOREIGN KEY (`Teacher_ID`) REFERENCES `teacher` (`Teacher_ID`),
  ADD CONSTRAINT `teacher_schedule_ibfk_2` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
