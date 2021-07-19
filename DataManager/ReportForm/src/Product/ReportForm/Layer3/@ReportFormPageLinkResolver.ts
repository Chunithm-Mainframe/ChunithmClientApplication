import { RoutingController } from "../../../Packages/Router/RoutingController";
import { RoutingNode } from "../../../Packages/Router/RoutingNode";
import { RoutingTreeEditor } from "../../../Packages/Router/RoutingTreeEditor";

export class ReportFormPageLinkResolver {
    private readonly _nodeMap: Record<string, RoutingNode> = {};

    public build(editor: RoutingTreeEditor, key: { prototype: RoutingController; name: string }, pathFormat: string): RoutingTreeEditor {
        const node = editor.build(pathFormat);
        this.addNode(key, node.node);
        return node;
    }

    public addNode(target: { prototype: RoutingController; name: string }, node: RoutingNode): void {
        this._nodeMap[target.name] = node;
    }

    public getNode(target: { prototype: RoutingController; name: string }): RoutingNode {
        return this._nodeMap[target.name];
    }
}
