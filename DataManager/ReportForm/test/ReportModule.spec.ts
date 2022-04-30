import { ReportModule } from "../src/Product/ReportForm/Layer3/Modules/Report/ReportModule";

describe("get level max op", () => {
    it("1;1", () => expect(ReportModule.getLevelMaxOp(1.0, 100)).toEqual(2000));
    it("1;2", () => expect(ReportModule.getLevelMaxOp(1.0, 5)).toEqual(100.0));

    it("2;1", () => expect(ReportModule.getLevelMaxOp(2.0, 100)).toEqual(2500));
    it("2;2", () => expect(ReportModule.getLevelMaxOp(2.0, 5)).toEqual(125.0));

    it("3;1", () => expect(ReportModule.getLevelMaxOp(3.0, 100)).toEqual(3000));
    it("3;2", () => expect(ReportModule.getLevelMaxOp(3.0, 5)).toEqual(150.0));

    it("4;1", () => expect(ReportModule.getLevelMaxOp(4.0, 100)).toEqual(3500));
    it("4;2", () => expect(ReportModule.getLevelMaxOp(4.0, 5)).toEqual(175.0));

    it("5;1", () => expect(ReportModule.getLevelMaxOp(5.0, 100)).toEqual(4000));
    it("5;2", () => expect(ReportModule.getLevelMaxOp(5.0, 5)).toEqual(200.0));

    it("6;1", () => expect(ReportModule.getLevelMaxOp(6.0, 100)).toEqual(4500));
    it("6;2", () => expect(ReportModule.getLevelMaxOp(6.0, 5)).toEqual(225.0));

    it("7;1", () => expect(ReportModule.getLevelMaxOp(7.0, 100)).toEqual(5000));
    it("7;2", () => expect(ReportModule.getLevelMaxOp(7.0, 5)).toEqual(250.0));

    it("7+;1", () => expect(ReportModule.getLevelMaxOp(7.5, 100)).toEqual(5250));
    it("7+;2", () => expect(ReportModule.getLevelMaxOp(7.5, 5)).toEqual(262.5));

    it("8;1", () => expect(ReportModule.getLevelMaxOp(8.0, 100)).toEqual(5500));
    it("8;2", () => expect(ReportModule.getLevelMaxOp(8.0, 5)).toEqual(275.0));

    it("8+;1", () => expect(ReportModule.getLevelMaxOp(8.5, 100)).toEqual(5750));
    it("8+;2", () => expect(ReportModule.getLevelMaxOp(8.5, 5)).toEqual(287.5));

    it("9;1", () => expect(ReportModule.getLevelMaxOp(9.0, 100)).toEqual(6000));
    it("9;1", () => expect(ReportModule.getLevelMaxOp(9.0, 5)).toEqual(300.0));

    it("9+;1", () => expect(ReportModule.getLevelMaxOp(9.5, 100)).toEqual(6250));
    it("9+;2", () => expect(ReportModule.getLevelMaxOp(9.5, 5)).toEqual(312.5));

    it("10;1", () => expect(ReportModule.getLevelMaxOp(10.0, 100)).toEqual(6500));
    it("10;2", () => expect(ReportModule.getLevelMaxOp(10.0, 5)).toEqual(325.0));

    it("10+;1", () => expect(ReportModule.getLevelMaxOp(10.5, 100)).toEqual(6750));
    it("10+;2", () => expect(ReportModule.getLevelMaxOp(10.5, 5)).toEqual(337.5));
});