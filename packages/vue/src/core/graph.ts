import { Graph, Shape, Addon, Node, Edge } from '@antv/x6'
import { PortManager } from '@antv/x6/lib/model/port'
import _ from 'lodash'
import {
    Event
} from './event'

export class mGraph extends Event {
    private graph: Graph
    stencil: Addon.Stencil
    ports = mGraph.defaultPorts
    container: HTMLElement
    data:Record<AnalyserNode,any>
    constructor() {
        super();
    }

    public getGraph() {
        return this.graph
    }

    getName() {
       return this.data.name;
    }


    createGraph(options: Graph.Options,data?:Record<AnalyserNode,any>) {
        this.container = options.container as HTMLElement
        let _options = _.merge({}, mGraph.defaultGraphOptions, options);
        this.graph = new Graph(_options)
        this.initDefaultKeyEvents()
        this.data = data;
        return this.graph
    }

    initDefaultKeyEvents() {
        let { graph } = this;
        //delete
        graph.bindKey('backspace', () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.removeCells(cells)
            }
        })

        //undo redo
        graph.bindKey(['command+z', 'ctrl+z'], () => {
            console.log(`###canundo is `,graph.history.canUndo())
            if (graph.history.canUndo()) {
                graph.history.undo()
            }
            return false
        })

        // select all
        graph.bindKey(['meta+a', 'ctrl+a'], () => {
            const nodes = graph.getNodes()
            if (nodes) {
                graph.select(nodes)
            }
        })

    }

    createStencil(options: Partial<Addon.Stencil.Options>, ele: HTMLElement) {
        let _options: Addon.Stencil.Options = _.merge({}, mGraph.defaultStencilOptions, options) as Addon.Stencil.Options
        _options.target = this.graph;
        this.stencil = new Addon.Stencil(_options)
        ele.appendChild(this.stencil.container)
        return this.stencil;
    }

    regitserNode() {

        let { ports, graph, container } = this;

        // 控制连接桩显示/隐藏
        const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
            for (let i = 0, len = ports.length; i < len; i = i + 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden'
            }
        }
        graph.on('node:mouseenter', () => {
            const ports = container.querySelectorAll(
                '.x6-port-body',
            ) as NodeListOf<SVGElement>
            showPorts(ports, true)
        })
        graph.on('node:mouseleave', () => {
            const ports = container.querySelectorAll(
                '.x6-port-body',
            ) as NodeListOf<SVGElement>
            showPorts(ports, false)
        })

        Graph.registerNode(
            'custom-rect',
            {
                inherit: 'rect',
                width: 66,
                height: 36,
                attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                },
                ports: _.cloneDeep(ports),
            },
            true,
        )

        Graph.registerNode(
            'custom-polygon',
            {
                inherit: 'polygon',

                width: 66,
                height: 36,
                attrs: {
                    body: {
                        strokeWidth: 1,
                        stroke: '#5F95FF',
                        fill: '#EFF4FF',
                    },
                    text: {
                        fontSize: 12,
                        fill: '#262626',
                    },
                },
                ports: {
                    ..._.cloneDeep(ports),
                    items: [
                        {
                            data: {
                                allowMult: false,
                                link: "in"
                            },
                            group: 'top',
                        },
                        {
                            data: {
                                allowMult: false,
                                link: "out",
                                type: "check"
                            },
                            group: 'bottom',
                        },
                        {
                            data: {
                                type: "check",
                                allowMult: false,
                                link: "out"
                            },
                            group: "right"
                        }
                    ],
                },
            },
            true,
        )


    }

    loadStencil() {
        let { graph, stencil } = this

        const r1 = graph.createNode({
            shape: 'custom-rect',
            label: '开始',
            attrs: {
                body: {
                    rx: 20,
                    ry: 26,
                },
            },
            data: {
                ..._.cloneDeep(mGraph.defaultNodeData),
                type: "start"
            }

        })
        const r2 = graph.createNode({
            shape: 'custom-rect',
            label: '过程',
            data: {
                ..._.cloneDeep(mGraph.defaultNodeData),
            }
        })
        const r3 = graph.createNode({
            shape: 'custom-rect',
            attrs: {
                body: {
                    rx: 20,
                    ry: 20,
                },
            },
            label: '结束',
            data: {
                ..._.cloneDeep(mGraph.defaultNodeData),
                type: "end"
            }
        })
        const r4 = graph.createNode({
            shape: 'custom-polygon',
            attrs: {
                body: {
                    refPoints: '0,10 10,0 20,10 10,20',
                },
            },
            label: '判断',
            data: {
                ..._.cloneDeep(mGraph.defaultNodeData),
                type: "check"
            }
        })
        stencil.load([r1, r2, r3, r4], 'group1')
    }

    on(name: any, handler: Event.Handler) {
        let { graph } = this
        graph.on(name, (...param: any[]) => {
            super.emit(name, ...param)
        })
        super.on(name, handler);
        return this;
    }

}


export namespace mGraph {

    export interface PortMeta extends PortManager.PortMetadata {
        data: {
            allowMult: boolean,
            link: "in" | "out",
            type: string
        }
    }

    export const defaultGraphOptions: Graph.Options = {
        grid: true,
        mousewheel: {
            enabled: true,
            zoomAtMousePosition: true,
            modifiers: 'ctrl',
            minScale: 0.5,
            maxScale: 3,
        },
        connecting: {
            router: {
                name: 'manhattan',
                args: {
                    padding: 1,
                },
            },
            connector: {
                name: 'rounded',
                args: {
                    radius: 8,
                },
            },
            anchor: 'center',
            connectionPoint: 'anchor',
            allowBlank: false,
            allowLoop: false,
            allowNode: false,
            snap: {
                radius: 20,
            },
            createEdge() {
                return new Shape.Edge({
                    attrs: {
                        line: {
                            stroke: '#A2B1C3',
                            strokeWidth: 2,
                            targetMarker: {
                                name: 'block',
                                width: 12,
                                height: 8,
                            },
                        },
                    },
                    zIndex: 0,
                })
            },
            validateConnection({ sourceCell, targetCell, sourcePort, targetPort, sourceView }) {

                let graph = sourceView?.graph

                let edges = graph?.getEdges() as Edge<Edge.Properties>[];
                // 当前这条连线先不算在内
                edges?.pop();
                let sourceNode = sourceCell as Node
                let targetNode = targetCell as Node;
                let sourcePorts = sourceNode.getPorts();
                let targetPorts = targetNode.getPorts();


                let sPort = _.find(sourcePorts, { id: sourcePort }) as PortMeta
                let tPort = _.find(targetPorts, { id: targetPort }) as PortMeta

                if (sPort.data.link === tPort.data.link) return false;

                for (let i = 0; i < edges?.length; i++) {
                    let edge = edges[i];
                    //@ts-ignore
                    let { port: edgeSourcePortId, cell: edgeSourceCellId } = edge.getTerminal('source');
                    //@ts-ignore
                    let { port: edgeTargetPortId, cell: edgeTaregtCellId } = edge.getTerminal('target');



                    // portId竟然相等
                    // 同一个node 下的同一个portid

                    if (edgeSourceCellId === sourceCell?.id && edgeSourcePortId === sPort.id && !sPort.data.allowMult) return false;
                    if (edgeTaregtCellId === targetCell?.id && edgeTargetPortId === tPort.id && !tPort.data.allowMult) return false;


                    // 允许多练的只有if/else 分支的输出连接到输入
                    if (sPort.data.allowMult && tPort.data.type !== "check") return false
                    if (tPort.data.allowMult && sPort.data.type !== "check") return false

                }



                return true
            },
        },
        highlighting: {
            magnetAdsorbed: {
                name: 'stroke',
                args: {
                    attrs: {
                        fill: '#5F95FF',
                        stroke: '#5F95FF',
                    },
                },
            },
        },
        resizing: true,
        rotating: true,
        selecting: {
            enabled: true,
            rubberband: true,
            showNodeSelectionBox: true,
        },
        snapline: true,
        clipboard: true,
        scroller: true,
        keyboard: {
            enabled: true,
            format(key) { 
              return key
              .replace(/\s/g, '')
              .replace('cmd', 'command')
            },
        },
        history:{
            enabled:true
        }
    }

    export const defaultStencilOptions = {
        title: '流程图',
        stencilGraphWidth: 200,
        stencilGraphHeight: 180,
        collapsable: true,
        groups: [
            {
                title: '基础元件',
                name: 'group1',
            }
        ],
        layoutOptions: {
            columns: 2,
            columnWidth: 80,
            rowHeight: 55,
        },
    }

    export const defaultPorts = {
        groups: {
            top: {
                position: 'top',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            right: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            bottom: {
                position: 'bottom',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            left: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#5F95FF',
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
        },
        items: [

            {
                data: {
                    allowMult: false,
                    link: "out"
                },
                group: 'right',
            },

            {
                data: {
                    allowMult: true,
                    link: "in"
                },

                group: 'left',
            },
        ],
    }


    export const defaultNodeData = {
        base: {

        },
        code: {
            source: ""
        },
        detail: {

        },
        type: "common"
    }

}