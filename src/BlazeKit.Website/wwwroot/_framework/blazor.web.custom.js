(() => {
    var e = { 778: () => {}, 77: () => {}, 203: () => {}, 200: () => {}, 628: () => {}, 321: () => {} },
        t = {};
    function n(o) {
        var r = t[o];
        if (void 0 !== r) return r.exports;
        var i = (t[o] = { exports: {} });
        return e[o](i, i.exports, n), i.exports;
    }
    (n.g = (function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")();
        } catch (e) {
            if ("object" == typeof window) return window;
        }
    })()),
        (() => {
            "use strict";
            var e, t, o;
            !(function (e) {
                const t = [],
                    n = "__jsObjectId",
                    o = "__dotNetObject",
                    r = "__byte[]",
                    i = "__dotNetStream",
                    s = "__jsStreamReferenceLength";
                let a, c;
                class l {
                    constructor(e) {
                        (this._jsObject = e), (this._cachedFunctions = new Map());
                    }
                    findFunction(e) {
                        const t = this._cachedFunctions.get(e);
                        if (t) return t;
                        let n,
                            o = this._jsObject;
                        if (
                            (e.split(".").forEach((t) => {
                                if (!(t in o)) throw new Error(`Could not find '${e}' ('${t}' was undefined).`);
                                (n = o), (o = o[t]);
                            }),
                            o instanceof Function)
                        )
                            return (o = o.bind(n)), this._cachedFunctions.set(e, o), o;
                        throw new Error(`The value '${e}' is not a function.`);
                    }
                    getWrappedObject() {
                        return this._jsObject;
                    }
                }
                const h = { 0: new l(window) };
                h[0]._cachedFunctions.set("import", (e) => ("string" == typeof e && e.startsWith("./") && (e = new URL(e.substr(2), document.baseURI).toString()), import(e)));
                let d,
                    u = 1;
                function p(e) {
                    t.push(e);
                }
                function f(e) {
                    if (e && "object" == typeof e) {
                        h[u] = new l(e);
                        const t = { [n]: u };
                        return u++, t;
                    }
                    throw new Error(`Cannot create a JSObjectReference from the value '${e}'.`);
                }
                function g(e) {
                    let t = -1;
                    if ((e instanceof ArrayBuffer && (e = new Uint8Array(e)), e instanceof Blob)) t = e.size;
                    else {
                        if (!(e.buffer instanceof ArrayBuffer)) throw new Error("Supplied value is not a typed array or blob.");
                        if (void 0 === e.byteLength) throw new Error(`Cannot create a JSStreamReference from the value '${e}' as it doesn't have a byteLength.`);
                        t = e.byteLength;
                    }
                    const o = { [s]: t };
                    try {
                        const t = f(e);
                        o[n] = t[n];
                    } catch (t) {
                        throw new Error(`Cannot create a JSStreamReference from the value '${e}'.`);
                    }
                    return o;
                }
                function m(e, n) {
                    c = e;
                    const o = n ? JSON.parse(n, (e, n) => t.reduce((t, n) => n(e, t), n)) : null;
                    return (c = void 0), o;
                }
                function v() {
                    if (void 0 === a) throw new Error("No call dispatcher has been set.");
                    if (null === a) throw new Error("There are multiple .NET runtimes present, so a default dispatcher could not be resolved. Use DotNetObject to invoke .NET instance methods.");
                    return a;
                }
                (e.attachDispatcher = function (e) {
                    const t = new y(e);
                    return void 0 === a ? (a = t) : a && (a = null), t;
                }),
                    (e.attachReviver = p),
                    (e.invokeMethod = function (e, t, ...n) {
                        return v().invokeDotNetStaticMethod(e, t, ...n);
                    }),
                    (e.invokeMethodAsync = function (e, t, ...n) {
                        return v().invokeDotNetStaticMethodAsync(e, t, ...n);
                    }),
                    (e.createJSObjectReference = f),
                    (e.createJSStreamReference = g),
                    (e.disposeJSObjectReference = function (e) {
                        const t = e && e[n];
                        "number" == typeof t && _(t);
                    }),
                    (function (e) {
                        (e[(e.Default = 0)] = "Default"), (e[(e.JSObjectReference = 1)] = "JSObjectReference"), (e[(e.JSStreamReference = 2)] = "JSStreamReference"), (e[(e.JSVoidResult = 3)] = "JSVoidResult");
                    })((d = e.JSCallResultType || (e.JSCallResultType = {})));
                class y {
                    constructor(e) {
                        (this._dotNetCallDispatcher = e), (this._byteArraysToBeRevived = new Map()), (this._pendingDotNetToJSStreams = new Map()), (this._pendingAsyncCalls = {}), (this._nextAsyncCallId = 1);
                    }
                    getDotNetCallDispatcher() {
                        return this._dotNetCallDispatcher;
                    }
                    invokeJSFromDotNet(e, t, n, o) {
                        const r = m(this, t),
                            i = I(b(e, o)(...(r || [])), n);
                        return null == i ? null : T(this, i);
                    }
                    beginInvokeJSFromDotNet(e, t, n, o, r) {
                        const i = new Promise((e) => {
                            const o = m(this, n);
                            e(b(t, r)(...(o || [])));
                        });
                        e &&
                            i
                                .then((t) => T(this, [e, !0, I(t, o)]))
                                .then(
                                    (t) => this._dotNetCallDispatcher.endInvokeJSFromDotNet(e, !0, t),
                                    (t) => this._dotNetCallDispatcher.endInvokeJSFromDotNet(e, !1, JSON.stringify([e, !1, w(t)]))
                                );
                    }
                    endInvokeDotNetFromJS(e, t, n) {
                        const o = t ? m(this, n) : new Error(n);
                        this.completePendingCall(parseInt(e, 10), t, o);
                    }
                    invokeDotNetStaticMethod(e, t, ...n) {
                        return this.invokeDotNetMethod(e, t, null, n);
                    }
                    invokeDotNetStaticMethodAsync(e, t, ...n) {
                        return this.invokeDotNetMethodAsync(e, t, null, n);
                    }
                    invokeDotNetMethod(e, t, n, o) {
                        if (this._dotNetCallDispatcher.invokeDotNetFromJS) {
                            const r = T(this, o),
                                i = this._dotNetCallDispatcher.invokeDotNetFromJS(e, t, n, r);
                            return i ? m(this, i) : null;
                        }
                        throw new Error("The current dispatcher does not support synchronous calls from JS to .NET. Use invokeDotNetMethodAsync instead.");
                    }
                    invokeDotNetMethodAsync(e, t, n, o) {
                        if (e && n) throw new Error(`For instance method calls, assemblyName should be null. Received '${e}'.`);
                        const r = this._nextAsyncCallId++,
                            i = new Promise((e, t) => {
                                this._pendingAsyncCalls[r] = { resolve: e, reject: t };
                            });
                        try {
                            const i = T(this, o);
                            this._dotNetCallDispatcher.beginInvokeDotNetFromJS(r, e, t, n, i);
                        } catch (e) {
                            this.completePendingCall(r, !1, e);
                        }
                        return i;
                    }
                    receiveByteArray(e, t) {
                        this._byteArraysToBeRevived.set(e, t);
                    }
                    processByteArray(e) {
                        const t = this._byteArraysToBeRevived.get(e);
                        return t ? (this._byteArraysToBeRevived.delete(e), t) : null;
                    }
                    supplyDotNetStream(e, t) {
                        if (this._pendingDotNetToJSStreams.has(e)) {
                            const n = this._pendingDotNetToJSStreams.get(e);
                            this._pendingDotNetToJSStreams.delete(e), n.resolve(t);
                        } else {
                            const n = new E();
                            n.resolve(t), this._pendingDotNetToJSStreams.set(e, n);
                        }
                    }
                    getDotNetStreamPromise(e) {
                        let t;
                        if (this._pendingDotNetToJSStreams.has(e)) (t = this._pendingDotNetToJSStreams.get(e).streamPromise), this._pendingDotNetToJSStreams.delete(e);
                        else {
                            const n = new E();
                            this._pendingDotNetToJSStreams.set(e, n), (t = n.streamPromise);
                        }
                        return t;
                    }
                    completePendingCall(e, t, n) {
                        if (!this._pendingAsyncCalls.hasOwnProperty(e)) throw new Error(`There is no pending async call with ID ${e}.`);
                        const o = this._pendingAsyncCalls[e];
                        delete this._pendingAsyncCalls[e], t ? o.resolve(n) : o.reject(n);
                    }
                }
                function w(e) {
                    return e instanceof Error ? `${e.message}\n${e.stack}` : e ? e.toString() : "null";
                }
                function b(e, t) {
                    const n = h[t];
                    if (n) return n.findFunction(e);
                    throw new Error(`JS object instance with ID ${t} does not exist (has it been disposed?).`);
                }
                function _(e) {
                    delete h[e];
                }
                (e.findJSFunction = b), (e.disposeJSObjectReferenceById = _);
                class S {
                    constructor(e, t) {
                        (this._id = e), (this._callDispatcher = t);
                    }
                    invokeMethod(e, ...t) {
                        return this._callDispatcher.invokeDotNetMethod(null, e, this._id, t);
                    }
                    invokeMethodAsync(e, ...t) {
                        return this._callDispatcher.invokeDotNetMethodAsync(null, e, this._id, t);
                    }
                    dispose() {
                        this._callDispatcher.invokeDotNetMethodAsync(null, "__Dispose", this._id, null).catch((e) => console.error(e));
                    }
                    serializeAsArg() {
                        return { [o]: this._id };
                    }
                }
                (e.DotNetObject = S),
                    p(function (e, t) {
                        if (t && "object" == typeof t) {
                            if (t.hasOwnProperty(o)) return new S(t[o], c);
                            if (t.hasOwnProperty(n)) {
                                const e = t[n],
                                    o = h[e];
                                if (o) return o.getWrappedObject();
                                throw new Error(`JS object instance with Id '${e}' does not exist. It may have been disposed.`);
                            }
                            if (t.hasOwnProperty(r)) {
                                const e = t[r],
                                    n = c.processByteArray(e);
                                if (void 0 === n) throw new Error(`Byte array index '${e}' does not exist.`);
                                return n;
                            }
                            if (t.hasOwnProperty(i)) {
                                const e = t[i],
                                    n = c.getDotNetStreamPromise(e);
                                return new C(n);
                            }
                        }
                        return t;
                    });
                class C {
                    constructor(e) {
                        this._streamPromise = e;
                    }
                    stream() {
                        return this._streamPromise;
                    }
                    async arrayBuffer() {
                        return new Response(await this.stream()).arrayBuffer();
                    }
                }
                class E {
                    constructor() {
                        this.streamPromise = new Promise((e, t) => {
                            (this.resolve = e), (this.reject = t);
                        });
                    }
                }
                function I(e, t) {
                    switch (t) {
                        case d.Default:
                            return e;
                        case d.JSObjectReference:
                            return f(e);
                        case d.JSStreamReference:
                            return g(e);
                        case d.JSVoidResult:
                            return null;
                        default:
                            throw new Error(`Invalid JS call result type '${t}'.`);
                    }
                }
                let k = 0;
                function T(e, t) {
                    (k = 0), (c = e);
                    const n = JSON.stringify(t, R);
                    return (c = void 0), n;
                }
                function R(e, t) {
                    if (t instanceof S) return t.serializeAsArg();
                    if (t instanceof Uint8Array) {
                        c.getDotNetCallDispatcher().sendByteArray(k, t);
                        const e = { [r]: k };
                        return k++, e;
                    }
                    return t;
                }
            })(e || (e = {})),
                (function (e) {
                    (e[(e.prependFrame = 1)] = "prependFrame"),
                        (e[(e.removeFrame = 2)] = "removeFrame"),
                        (e[(e.setAttribute = 3)] = "setAttribute"),
                        (e[(e.removeAttribute = 4)] = "removeAttribute"),
                        (e[(e.updateText = 5)] = "updateText"),
                        (e[(e.stepIn = 6)] = "stepIn"),
                        (e[(e.stepOut = 7)] = "stepOut"),
                        (e[(e.updateMarkup = 8)] = "updateMarkup"),
                        (e[(e.permutationListEntry = 9)] = "permutationListEntry"),
                        (e[(e.permutationListEnd = 10)] = "permutationListEnd");
                })(t || (t = {})),
                (function (e) {
                    (e[(e.element = 1)] = "element"),
                        (e[(e.text = 2)] = "text"),
                        (e[(e.attribute = 3)] = "attribute"),
                        (e[(e.component = 4)] = "component"),
                        (e[(e.region = 5)] = "region"),
                        (e[(e.elementReferenceCapture = 6)] = "elementReferenceCapture"),
                        (e[(e.markup = 8)] = "markup"),
                        (e[(e.namedEvent = 10)] = "namedEvent");
                })(o || (o = {}));
            class r {
                constructor(e, t) {
                    (this.componentId = e), (this.fieldValue = t);
                }
                static fromEvent(e, t) {
                    const n = t.target;
                    if (n instanceof Element) {
                        const t = (function (e) {
                            return e instanceof HTMLInputElement
                                ? e.type && "checkbox" === e.type.toLowerCase()
                                    ? { value: e.checked }
                                    : { value: e.value }
                                : e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement
                                ? { value: e.value }
                                : null;
                        })(n);
                        if (t) return new r(e, t.value);
                    }
                    return null;
                }
            }
            const i = new Map(),
                s = new Map(),
                a = [];
            function c(e) {
                return i.get(e);
            }
            function l(e) {
                const t = i.get(e);
                return (null == t ? void 0 : t.browserEventName) || e;
            }
            function h(e, t) {
                e.forEach((e) => i.set(e, t));
            }
            function d(e) {
                const t = [];
                for (let n = 0; n < e.length; n++) {
                    const o = e[n];
                    t.push({ identifier: o.identifier, clientX: o.clientX, clientY: o.clientY, screenX: o.screenX, screenY: o.screenY, pageX: o.pageX, pageY: o.pageY });
                }
                return t;
            }
            function u(e) {
                return {
                    detail: e.detail,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    offsetX: e.offsetX,
                    offsetY: e.offsetY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    movementX: e.movementX,
                    movementY: e.movementY,
                    button: e.button,
                    buttons: e.buttons,
                    ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey,
                    altKey: e.altKey,
                    metaKey: e.metaKey,
                    type: e.type,
                };
            }
            h(["input", "change"], {
                createEventArgs: function (e) {
                    const t = e.target;
                    if (
                        (function (e) {
                            return -1 !== p.indexOf(e.getAttribute("type"));
                        })(t)
                    ) {
                        const e = (function (e) {
                            const t = e.value,
                                n = e.type;
                            switch (n) {
                                case "date":
                                case "month":
                                case "week":
                                    return t;
                                case "datetime-local":
                                    return 16 === t.length ? t + ":00" : t;
                                case "time":
                                    return 5 === t.length ? t + ":00" : t;
                            }
                            throw new Error(`Invalid element type '${n}'.`);
                        })(t);
                        return { value: e };
                    }
                    if (
                        (function (e) {
                            return e instanceof HTMLSelectElement && "select-multiple" === e.type;
                        })(t)
                    ) {
                        const e = t;
                        return {
                            value: Array.from(e.options)
                                .filter((e) => e.selected)
                                .map((e) => e.value),
                        };
                    }
                    {
                        const e = (function (e) {
                            return !!e && "INPUT" === e.tagName && "checkbox" === e.getAttribute("type");
                        })(t);
                        return { value: e ? !!t.checked : t.value };
                    }
                },
            }),
                h(["copy", "cut", "paste"], { createEventArgs: (e) => ({ type: e.type }) }),
                h(["drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop"], {
                    createEventArgs: (e) => {
                        return {
                            ...u((t = e)),
                            dataTransfer: t.dataTransfer
                                ? {
                                      dropEffect: t.dataTransfer.dropEffect,
                                      effectAllowed: t.dataTransfer.effectAllowed,
                                      files: Array.from(t.dataTransfer.files).map((e) => e.name),
                                      items: Array.from(t.dataTransfer.items).map((e) => ({ kind: e.kind, type: e.type })),
                                      types: t.dataTransfer.types,
                                  }
                                : null,
                        };
                        var t;
                    },
                }),
                h(["focus", "blur", "focusin", "focusout"], { createEventArgs: (e) => ({ type: e.type }) }),
                h(["keydown", "keyup", "keypress"], {
                    createEventArgs: (e) => {
                        return { key: (t = e).key, code: t.code, location: t.location, repeat: t.repeat, ctrlKey: t.ctrlKey, shiftKey: t.shiftKey, altKey: t.altKey, metaKey: t.metaKey, type: t.type };
                        var t;
                    },
                }),
                h(["contextmenu", "click", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "mouseleave", "mouseenter", "dblclick"], { createEventArgs: (e) => u(e) }),
                h(["error"], {
                    createEventArgs: (e) => {
                        return { message: (t = e).message, filename: t.filename, lineno: t.lineno, colno: t.colno, type: t.type };
                        var t;
                    },
                }),
                h(["loadstart", "timeout", "abort", "load", "loadend", "progress"], {
                    createEventArgs: (e) => {
                        return { lengthComputable: (t = e).lengthComputable, loaded: t.loaded, total: t.total, type: t.type };
                        var t;
                    },
                }),
                h(["touchcancel", "touchend", "touchmove", "touchenter", "touchleave", "touchstart"], {
                    createEventArgs: (e) => {
                        return {
                            detail: (t = e).detail,
                            touches: d(t.touches),
                            targetTouches: d(t.targetTouches),
                            changedTouches: d(t.changedTouches),
                            ctrlKey: t.ctrlKey,
                            shiftKey: t.shiftKey,
                            altKey: t.altKey,
                            metaKey: t.metaKey,
                            type: t.type,
                        };
                        var t;
                    },
                }),
                h(["gotpointercapture", "lostpointercapture", "pointercancel", "pointerdown", "pointerenter", "pointerleave", "pointermove", "pointerout", "pointerover", "pointerup"], {
                    createEventArgs: (e) => {
                        return { ...u((t = e)), pointerId: t.pointerId, width: t.width, height: t.height, pressure: t.pressure, tiltX: t.tiltX, tiltY: t.tiltY, pointerType: t.pointerType, isPrimary: t.isPrimary };
                        var t;
                    },
                }),
                h(["wheel", "mousewheel"], {
                    createEventArgs: (e) => {
                        return { ...u((t = e)), deltaX: t.deltaX, deltaY: t.deltaY, deltaZ: t.deltaZ, deltaMode: t.deltaMode };
                        var t;
                    },
                }),
                h(["cancel", "close", "toggle"], { createEventArgs: () => ({}) });
            const p = ["date", "datetime-local", "month", "time", "week"],
                f = new Map();
            let g,
                m,
                v = 0;
            const y = {
                async add(e, t, n) {
                    if (!n) throw new Error("initialParameters must be an object, even if empty.");
                    const o = "__bl-dynamic-root:" + (++v).toString();
                    f.set(o, e);
                    const r = await S().invokeMethodAsync("AddRootComponent", t, o),
                        i = new _(r, m[t]);
                    return await i.setParameters(n), i;
                },
            };
            function w(e) {
                const t = f.get(e);
                if (t) return f.delete(e), t;
            }
            class b {
                invoke(e) {
                    return this._callback(e);
                }
                setCallback(t) {
                    this._selfJSObjectReference || (this._selfJSObjectReference = e.createJSObjectReference(this)), (this._callback = t);
                }
                getJSObjectReference() {
                    return this._selfJSObjectReference;
                }
                dispose() {
                    this._selfJSObjectReference && e.disposeJSObjectReference(this._selfJSObjectReference);
                }
            }
            class _ {
                constructor(e, t) {
                    (this._jsEventCallbackWrappers = new Map()), (this._componentId = e);
                    for (const e of t) "eventcallback" === e.type && this._jsEventCallbackWrappers.set(e.name.toLowerCase(), new b());
                }
                setParameters(e) {
                    const t = {},
                        n = Object.entries(e || {}),
                        o = n.length;
                    for (const [e, o] of n) {
                        const n = this._jsEventCallbackWrappers.get(e.toLowerCase());
                        n && o ? (n.setCallback(o), (t[e] = n.getJSObjectReference())) : (t[e] = o);
                    }
                    return S().invokeMethodAsync("SetRootComponentParameters", this._componentId, o, t);
                }
                async dispose() {
                    if (null !== this._componentId) {
                        await S().invokeMethodAsync("RemoveRootComponent", this._componentId), (this._componentId = null);
                        for (const e of this._jsEventCallbackWrappers.values()) e.dispose();
                    }
                }
            }
            function S() {
                if (!g) throw new Error("Dynamic root components have not been enabled in this application.");
                return g;
            }
            const C = new Map(),
                E = [],
                I = new Map();
            function k(t, n, o, r) {
                var i, s;
                if (C.has(t)) throw new Error(`Interop methods are already registered for renderer ${t}`);
                C.set(t, n),
                    o &&
                        r &&
                        Object.keys(o).length > 0 &&
                        (function (t, n, o) {
                            if (g) throw new Error("Dynamic root components have already been enabled.");
                            (g = t), (m = n);
                            for (const [t, r] of Object.entries(o)) {
                                const o = e.findJSFunction(t, 0);
                                for (const e of r) o(e, n[e]);
                            }
                        })(A(t), o, r),
                    null === (s = null === (i = I.get(t)) || void 0 === i ? void 0 : i[0]) || void 0 === s || s.call(i),
                    (function (e) {
                        for (const t of E) t(e);
                    })(t);
            }
            function T(e) {
                return C.has(e);
            }
            function R(e, t, n) {
                return D(e, t.eventHandlerId, () => A(e).invokeMethodAsync("DispatchEventAsync", t, n));
            }
            function A(e) {
                const t = C.get(e);
                if (!t) throw new Error(`No interop methods are registered for renderer ${e}`);
                return t;
            }
            let D = (e, t, n) => n();
            const x = B([
                    "abort",
                    "blur",
                    "cancel",
                    "canplay",
                    "canplaythrough",
                    "change",
                    "close",
                    "cuechange",
                    "durationchange",
                    "emptied",
                    "ended",
                    "error",
                    "focus",
                    "load",
                    "loadeddata",
                    "loadedmetadata",
                    "loadend",
                    "loadstart",
                    "mouseenter",
                    "mouseleave",
                    "pointerenter",
                    "pointerleave",
                    "pause",
                    "play",
                    "playing",
                    "progress",
                    "ratechange",
                    "reset",
                    "scroll",
                    "seeked",
                    "seeking",
                    "stalled",
                    "submit",
                    "suspend",
                    "timeupdate",
                    "toggle",
                    "unload",
                    "volumechange",
                    "waiting",
                    "DOMNodeInsertedIntoDocument",
                    "DOMNodeRemovedFromDocument",
                ]),
                N = { submit: !0 },
                M = B(["click", "dblclick", "mousedown", "mousemove", "mouseup"]);
            class P {
                constructor(e) {
                    (this.browserRendererId = e), (this.afterClickCallbacks = []);
                    const t = ++P.nextEventDelegatorId;
                    (this.eventsCollectionKey = `_blazorEvents_${t}`), (this.eventInfoStore = new U(this.onGlobalEvent.bind(this)));
                }
                setListener(e, t, n, o) {
                    const r = this.getEventHandlerInfosForElement(e, !0),
                        i = r.getHandler(t);
                    if (i) this.eventInfoStore.update(i.eventHandlerId, n);
                    else {
                        const i = { element: e, eventName: t, eventHandlerId: n, renderingComponentId: o };
                        this.eventInfoStore.add(i), r.setHandler(t, i);
                    }
                }
                getHandler(e) {
                    return this.eventInfoStore.get(e);
                }
                removeListener(e) {
                    const t = this.eventInfoStore.remove(e);
                    if (t) {
                        const e = t.element,
                            n = this.getEventHandlerInfosForElement(e, !1);
                        n && n.removeHandler(t.eventName);
                    }
                }
                notifyAfterClick(e) {
                    this.afterClickCallbacks.push(e), this.eventInfoStore.addGlobalListener("click");
                }
                setStopPropagation(e, t, n) {
                    this.getEventHandlerInfosForElement(e, !0).stopPropagation(t, n);
                }
                setPreventDefault(e, t, n) {
                    this.getEventHandlerInfosForElement(e, !0).preventDefault(t, n);
                }
                onGlobalEvent(e) {
                    if (!(e.target instanceof Element)) return;
                    this.dispatchGlobalEventToAllElements(e.type, e);
                    const t = ((n = e.type), s.get(n));
                    var n;
                    t && t.forEach((t) => this.dispatchGlobalEventToAllElements(t, e)), "click" === e.type && this.afterClickCallbacks.forEach((t) => t(e));
                }
                dispatchGlobalEventToAllElements(e, t) {
                    const n = t.composedPath();
                    let o = n.shift(),
                        i = null,
                        s = !1;
                    const a = Object.prototype.hasOwnProperty.call(x, e);
                    let l = !1;
                    for (; o; ) {
                        const u = o,
                            p = this.getEventHandlerInfosForElement(u, !1);
                        if (p) {
                            const n = p.getHandler(e);
                            if (
                                n &&
                                ((h = u),
                                (d = t.type),
                                !((h instanceof HTMLButtonElement || h instanceof HTMLInputElement || h instanceof HTMLTextAreaElement || h instanceof HTMLSelectElement) && Object.prototype.hasOwnProperty.call(M, d) && h.disabled))
                            ) {
                                if (!s) {
                                    const n = c(e);
                                    (i = (null == n ? void 0 : n.createEventArgs) ? n.createEventArgs(t) : {}), (s = !0);
                                }
                                Object.prototype.hasOwnProperty.call(N, t.type) && t.preventDefault(), R(this.browserRendererId, { eventHandlerId: n.eventHandlerId, eventName: e, eventFieldInfo: r.fromEvent(n.renderingComponentId, t) }, i);
                            }
                            p.stopPropagation(e) && (l = !0), p.preventDefault(e) && t.preventDefault();
                        }
                        o = a || l ? void 0 : n.shift();
                    }
                    var h, d;
                }
                getEventHandlerInfosForElement(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, this.eventsCollectionKey) ? e[this.eventsCollectionKey] : t ? (e[this.eventsCollectionKey] = new L()) : null;
                }
            }
            P.nextEventDelegatorId = 0;
            class U {
                constructor(e) {
                    (this.globalListener = e), (this.infosByEventHandlerId = {}), (this.countByEventName = {}), a.push(this.handleEventNameAliasAdded.bind(this));
                }
                add(e) {
                    if (this.infosByEventHandlerId[e.eventHandlerId]) throw new Error(`Event ${e.eventHandlerId} is already tracked`);
                    (this.infosByEventHandlerId[e.eventHandlerId] = e), this.addGlobalListener(e.eventName);
                }
                get(e) {
                    return this.infosByEventHandlerId[e];
                }
                addGlobalListener(e) {
                    if (((e = l(e)), Object.prototype.hasOwnProperty.call(this.countByEventName, e))) this.countByEventName[e]++;
                    else {
                        this.countByEventName[e] = 1;
                        const t = Object.prototype.hasOwnProperty.call(x, e);
                        document.addEventListener(e, this.globalListener, t);
                    }
                }
                update(e, t) {
                    if (Object.prototype.hasOwnProperty.call(this.infosByEventHandlerId, t)) throw new Error(`Event ${t} is already tracked`);
                    const n = this.infosByEventHandlerId[e];
                    delete this.infosByEventHandlerId[e], (n.eventHandlerId = t), (this.infosByEventHandlerId[t] = n);
                }
                remove(e) {
                    const t = this.infosByEventHandlerId[e];
                    if (t) {
                        delete this.infosByEventHandlerId[e];
                        const n = l(t.eventName);
                        0 == --this.countByEventName[n] && (delete this.countByEventName[n], document.removeEventListener(n, this.globalListener));
                    }
                    return t;
                }
                handleEventNameAliasAdded(e, t) {
                    if (Object.prototype.hasOwnProperty.call(this.countByEventName, e)) {
                        const n = this.countByEventName[e];
                        delete this.countByEventName[e], document.removeEventListener(e, this.globalListener), this.addGlobalListener(t), (this.countByEventName[t] += n - 1);
                    }
                }
            }
            class L {
                constructor() {
                    (this.handlers = {}), (this.preventDefaultFlags = null), (this.stopPropagationFlags = null);
                }
                getHandler(e) {
                    return Object.prototype.hasOwnProperty.call(this.handlers, e) ? this.handlers[e] : null;
                }
                setHandler(e, t) {
                    this.handlers[e] = t;
                }
                removeHandler(e) {
                    delete this.handlers[e];
                }
                preventDefault(e, t) {
                    return void 0 !== t && ((this.preventDefaultFlags = this.preventDefaultFlags || {}), (this.preventDefaultFlags[e] = t)), !!this.preventDefaultFlags && this.preventDefaultFlags[e];
                }
                stopPropagation(e, t) {
                    return void 0 !== t && ((this.stopPropagationFlags = this.stopPropagationFlags || {}), (this.stopPropagationFlags[e] = t)), !!this.stopPropagationFlags && this.stopPropagationFlags[e];
                }
            }
            function B(e) {
                const t = {};
                return (
                    e.forEach((e) => {
                        t[e] = !0;
                    }),
                    t
                );
            }
            const O = Symbol(),
                F = Symbol(),
                $ = Symbol();
            function H(e) {
                const { start: t, end: n } = e,
                    o = t[$];
                if (o) {
                    if (o !== e) throw new Error("The start component comment was already associated with another component descriptor.");
                    return t;
                }
                const r = t.parentNode;
                if (!r) throw new Error(`Comment not connected to the DOM ${t.textContent}`);
                const i = W(r, !0),
                    s = Y(i);
                (t[F] = i), (t[$] = e);
                const a = W(t);
                if (n) {
                    const e = Y(a),
                        o = Array.prototype.indexOf.call(s, a) + 1;
                    let r = null;
                    for (; r !== n; ) {
                        const n = s.splice(o, 1)[0];
                        if (!n) throw new Error("Could not find the end component comment in the parent logical node list");
                        (n[F] = t), e.push(n), (r = n);
                    }
                }
                return a;
            }
            function W(e, t) {
                if (O in e) return e;
                const n = [];
                if (e.childNodes.length > 0) {
                    if (!t) throw new Error("New logical elements must start empty, or allowExistingContents must be true");
                    e.childNodes.forEach((t) => {
                        const o = W(t, !0);
                        (o[F] = e), n.push(o);
                    });
                }
                return (e[O] = n), e;
            }
            function j(e) {
                const t = Y(e);
                for (; t.length; ) J(e, 0);
            }
            function z(e, t) {
                const n = document.createComment("!");
                return q(n, e, t), n;
            }
            function q(e, t, n) {
                const o = e;
                let r = e;
                if (e instanceof Comment) {
                    const t = Y(o);
                    if ((null == t ? void 0 : t.length) > 0) {
                        const t = oe(o),
                            n = new Range();
                        n.setStartBefore(e), n.setEndAfter(t), (r = n.extractContents());
                    }
                }
                const i = K(o);
                if (i) {
                    const e = Y(i),
                        t = Array.prototype.indexOf.call(e, o);
                    e.splice(t, 1), delete o[F];
                }
                const s = Y(t);
                if (n < s.length) {
                    const e = s[n];
                    e.parentNode.insertBefore(r, e), s.splice(n, 0, o);
                } else ne(r, t), s.push(o);
                (o[F] = t), O in o || (o[O] = []);
            }
            function J(e, t) {
                const n = Y(e).splice(t, 1)[0];
                if (n instanceof Comment) {
                    const e = Y(n);
                    if (e) for (; e.length > 0; ) J(n, 0);
                }
                const o = n;
                o.parentNode.removeChild(o);
            }
            function K(e) {
                return e[F] || null;
            }
            function V(e, t) {
                return Y(e)[t];
            }
            function X(e) {
                return e[$] || null;
            }
            function G(e) {
                const t = te(e);
                return "http://www.w3.org/2000/svg" === t.namespaceURI && "foreignObject" !== t.tagName;
            }
            function Y(e) {
                return e[O];
            }
            function Q(e) {
                const t = Y(K(e));
                return t[Array.prototype.indexOf.call(t, e) + 1] || null;
            }
            function Z(e) {
                return O in e;
            }
            function ee(e, t) {
                const n = Y(e);
                t.forEach((e) => {
                    (e.moveRangeStart = n[e.fromSiblingIndex]), (e.moveRangeEnd = oe(e.moveRangeStart));
                }),
                    t.forEach((t) => {
                        const o = document.createComment("marker");
                        t.moveToBeforeMarker = o;
                        const r = n[t.toSiblingIndex + 1];
                        r ? r.parentNode.insertBefore(o, r) : ne(o, e);
                    }),
                    t.forEach((e) => {
                        const t = e.moveToBeforeMarker,
                            n = t.parentNode,
                            o = e.moveRangeStart,
                            r = e.moveRangeEnd;
                        let i = o;
                        for (; i; ) {
                            const e = i.nextSibling;
                            if ((n.insertBefore(i, t), i === r)) break;
                            i = e;
                        }
                        n.removeChild(t);
                    }),
                    t.forEach((e) => {
                        n[e.toSiblingIndex] = e.moveRangeStart;
                    });
            }
            function te(e) {
                if (e instanceof Element || e instanceof DocumentFragment) return e;
                if (e instanceof Comment) return e.parentNode;
                throw new Error("Not a valid logical element");
            }
            function ne(e, t) {
                if (t instanceof Element || t instanceof DocumentFragment) t.appendChild(e);
                else {
                    if (!(t instanceof Comment)) throw new Error(`Cannot append node because the parent is not a valid logical element. Parent: ${t}`);
                    {
                        const n = Q(t);
                        n ? n.parentNode.insertBefore(e, n) : ne(e, K(t));
                    }
                }
            }
            function oe(e) {
                if (e instanceof Element || e instanceof DocumentFragment) return e;
                const t = Q(e);
                if (t) return t.previousSibling;
                {
                    const t = K(e);
                    return t instanceof Element || t instanceof DocumentFragment ? t.lastChild : oe(t);
                }
            }
            function re(e) {
                return `_bl_${e}`;
            }
            const ie = "__internalId";
            e.attachReviver((e, t) =>
                t && "object" == typeof t && Object.prototype.hasOwnProperty.call(t, ie) && "string" == typeof t[ie]
                    ? (function (e) {
                          const t = `[${re(e)}]`;
                          return document.querySelector(t);
                      })(t[ie])
                    : t
            );
            const se = "_blazorDeferredValue";
            function ae(e) {
                e instanceof HTMLOptionElement ? de(e) : se in e && he(e, e[se]);
            }
            function ce(e) {
                return "select-multiple" === e.type;
            }
            function le(e, t) {
                e.value = t || "";
            }
            function he(e, t) {
                e instanceof HTMLSelectElement
                    ? ce(e)
                        ? (function (e, t) {
                              t || (t = []);
                              for (let n = 0; n < e.options.length; n++) e.options[n].selected = -1 !== t.indexOf(e.options[n].value);
                          })(e, t)
                        : le(e, t)
                    : (e.value = t);
            }
            function de(e) {
                const t = (function (e) {
                    for (; e; ) {
                        if (e instanceof HTMLSelectElement) return e;
                        e = e.parentElement;
                    }
                    return null;
                })(e);
                if (
                    !(function (e) {
                        return !!e && se in e;
                    })(t)
                )
                    return !1;
                if (ce(t)) e.selected = -1 !== t._blazorDeferredValue.indexOf(e.value);
                else {
                    if (t._blazorDeferredValue !== e.value) return !1;
                    le(t, e.value), delete t._blazorDeferredValue;
                }
                return !0;
            }
            const ue = document.createElement("template"),
                pe = document.createElementNS("http://www.w3.org/2000/svg", "g"),
                fe = new Set(),
                ge = Symbol(),
                me = Symbol();
            class ve {
                constructor(e) {
                    (this.rootComponentIds = new Set()),
                        (this.childComponentLocations = {}),
                        (this.eventDelegator = new P(e)),
                        this.eventDelegator.notifyAfterClick((e) => {
                            Be() &&
                                Ne(e, (e) => {
                                    Ve(e, !0, !1);
                                });
                        });
                }
                getRootComponentCount() {
                    return this.rootComponentIds.size;
                }
                attachRootComponentToLogicalElement(e, t, n) {
                    if (we(t)) throw new Error(`Root component '${e}' could not be attached because its target element is already associated with a root component`);
                    n && (t = z(t, Y(t).length)), ye(t, !0), this.attachComponentToElement(e, t), this.rootComponentIds.add(e), fe.add(t);
                }
                updateComponent(e, t, n, o) {
                    var r;
                    const i = this.childComponentLocations[t];
                    if (!i) throw new Error(`No element is currently associated with component ${t}`);
                    fe.delete(i) && (j(i), i instanceof Comment && (i.textContent = "!"));
                    const s = null === (r = te(i)) || void 0 === r ? void 0 : r.getRootNode(),
                        a = s && s.activeElement;
                    this.applyEdits(e, t, i, 0, n, o), a instanceof HTMLElement && s && s.activeElement !== a && a.focus();
                }
                disposeComponent(e) {
                    if (this.rootComponentIds.delete(e)) {
                        const t = this.childComponentLocations[e];
                        ye(t, !1), !0 === t[me] ? fe.add(t) : j(t);
                    }
                    delete this.childComponentLocations[e];
                }
                disposeEventHandler(e) {
                    this.eventDelegator.removeListener(e);
                }
                attachComponentToElement(e, t) {
                    this.childComponentLocations[e] = t;
                }
                applyEdits(e, n, o, r, i, s) {
                    let a,
                        c = 0,
                        l = r;
                    const h = e.arrayBuilderSegmentReader,
                        d = e.editReader,
                        u = e.frameReader,
                        p = h.values(i),
                        f = h.offset(i),
                        g = f + h.count(i);
                    for (let i = f; i < g; i++) {
                        const h = e.diffReader.editsEntry(p, i),
                            f = d.editType(h);
                        switch (f) {
                            case t.prependFrame: {
                                const t = d.newTreeIndex(h),
                                    r = e.referenceFramesEntry(s, t),
                                    i = d.siblingIndex(h);
                                this.insertFrame(e, n, o, l + i, s, r, t);
                                break;
                            }
                            case t.removeFrame:
                                J(o, l + d.siblingIndex(h));
                                break;
                            case t.setAttribute: {
                                const t = d.newTreeIndex(h),
                                    r = e.referenceFramesEntry(s, t),
                                    i = V(o, l + d.siblingIndex(h));
                                if (!(i instanceof Element)) throw new Error("Cannot set attribute on non-element child");
                                this.applyAttribute(e, n, i, r);
                                break;
                            }
                            case t.removeAttribute: {
                                const e = V(o, l + d.siblingIndex(h));
                                if (!(e instanceof Element)) throw new Error("Cannot remove attribute from non-element child");
                                {
                                    const t = d.removedAttributeName(h);
                                    this.setOrRemoveAttributeOrProperty(e, t, null);
                                }
                                break;
                            }
                            case t.updateText: {
                                const t = d.newTreeIndex(h),
                                    n = e.referenceFramesEntry(s, t),
                                    r = V(o, l + d.siblingIndex(h));
                                if (!(r instanceof Text)) throw new Error("Cannot set text content on non-text child");
                                r.textContent = u.textContent(n);
                                break;
                            }
                            case t.updateMarkup: {
                                const t = d.newTreeIndex(h),
                                    n = e.referenceFramesEntry(s, t),
                                    r = d.siblingIndex(h);
                                J(o, l + r), this.insertMarkup(e, o, l + r, n);
                                break;
                            }
                            case t.stepIn:
                                (o = V(o, l + d.siblingIndex(h))), c++, (l = 0);
                                break;
                            case t.stepOut:
                                (o = K(o)), c--, (l = 0 === c ? r : 0);
                                break;
                            case t.permutationListEntry:
                                (a = a || []), a.push({ fromSiblingIndex: l + d.siblingIndex(h), toSiblingIndex: l + d.moveToSiblingIndex(h) });
                                break;
                            case t.permutationListEnd:
                                ee(o, a), (a = void 0);
                                break;
                            default:
                                throw new Error(`Unknown edit type: ${f}`);
                        }
                    }
                }
                insertFrame(e, t, n, r, i, s, a) {
                    const c = e.frameReader,
                        l = c.frameType(s);
                    switch (l) {
                        case o.element:
                            return this.insertElement(e, t, n, r, i, s, a), 1;
                        case o.text:
                            return this.insertText(e, n, r, s), 1;
                        case o.attribute:
                            throw new Error("Attribute frames should only be present as leading children of element frames.");
                        case o.component:
                            return this.insertComponent(e, n, r, s), 1;
                        case o.region:
                            return this.insertFrameRange(e, t, n, r, i, a + 1, a + c.subtreeLength(s));
                        case o.elementReferenceCapture:
                            if (n instanceof Element) return (h = n), (d = c.elementReferenceCaptureId(s)), h.setAttribute(re(d), ""), 0;
                            throw new Error("Reference capture frames can only be children of element frames.");
                        case o.markup:
                            return this.insertMarkup(e, n, r, s), 1;
                        case o.namedEvent:
                            return 0;
                        default:
                            throw new Error(`Unknown frame type: ${l}`);
                    }
                    var h, d;
                }
                insertElement(e, t, n, r, i, s, a) {
                    const c = e.frameReader,
                        l = c.elementName(s),
                        h = "svg" === l || G(n) ? document.createElementNS("http://www.w3.org/2000/svg", l) : document.createElement(l),
                        d = W(h);
                    let u = !1;
                    const p = a + c.subtreeLength(s);
                    for (let s = a + 1; s < p; s++) {
                        const a = e.referenceFramesEntry(i, s);
                        if (c.frameType(a) !== o.attribute) {
                            q(h, n, r), (u = !0), this.insertFrameRange(e, t, d, 0, i, s, p);
                            break;
                        }
                        this.applyAttribute(e, t, h, a);
                    }
                    u || q(h, n, r), ae(h);
                }
                insertComponent(e, t, n, o) {
                    const r = z(t, n),
                        i = e.frameReader.componentId(o);
                    this.attachComponentToElement(i, r);
                }
                insertText(e, t, n, o) {
                    const r = e.frameReader.textContent(o);
                    q(document.createTextNode(r), t, n);
                }
                insertMarkup(e, t, n, o) {
                    const r = z(t, n),
                        i =
                            ((s = e.frameReader.markupContent(o)),
                            G(t)
                                ? ((pe.innerHTML = s || " "), pe)
                                : ((ue.innerHTML = s || " "),
                                  ue.content.querySelectorAll("script").forEach((e) => {
                                      const t = document.createElement("script");
                                      (t.textContent = e.textContent),
                                          e.getAttributeNames().forEach((n) => {
                                              t.setAttribute(n, e.getAttribute(n));
                                          }),
                                          e.parentNode.replaceChild(t, e);
                                  }),
                                  ue.content));
                    var s;
                    let a = 0;
                    for (; i.firstChild; ) q(i.firstChild, r, a++);
                }
                applyAttribute(e, t, n, o) {
                    const r = e.frameReader,
                        i = r.attributeName(o),
                        s = r.attributeEventHandlerId(o);
                    if (s) {
                        const e = Se(i);
                        return void this.eventDelegator.setListener(n, e, s, t);
                    }
                    const a = r.attributeValue(o);
                    this.setOrRemoveAttributeOrProperty(n, i, a);
                }
                insertFrameRange(e, t, n, o, r, i, s) {
                    const a = o;
                    for (let a = i; a < s; a++) {
                        const i = e.referenceFramesEntry(r, a);
                        (o += this.insertFrame(e, t, n, o, r, i, a)), (a += _e(e, i));
                    }
                    return o - a;
                }
                setOrRemoveAttributeOrProperty(e, t, n) {
                    (function (e, t, n) {
                        switch (t) {
                            case "value":
                                return (function (e, t) {
                                    switch (
                                        (t &&
                                            "INPUT" === e.tagName &&
                                            (t = (function (e, t) {
                                                switch (t.getAttribute("type")) {
                                                    case "time":
                                                        return 8 !== e.length || (!e.endsWith("00") && t.hasAttribute("step")) ? e : e.substring(0, 5);
                                                    case "datetime-local":
                                                        return 19 !== e.length || (!e.endsWith("00") && t.hasAttribute("step")) ? e : e.substring(0, 16);
                                                    default:
                                                        return e;
                                                }
                                            })(t, e)),
                                        e.tagName)
                                    ) {
                                        case "INPUT":
                                        case "SELECT":
                                        case "TEXTAREA":
                                            return t && e instanceof HTMLSelectElement && ce(e) && (t = JSON.parse(t)), he(e, t), (e[se] = t), !0;
                                        case "OPTION":
                                            return t || "" === t ? e.setAttribute("value", t) : e.removeAttribute("value"), de(e), !0;
                                        default:
                                            return !1;
                                    }
                                })(e, n);
                            case "checked":
                                return (function (e, t) {
                                    return "INPUT" === e.tagName && ((e.checked = null !== t), !0);
                                })(e, n);
                            default:
                                return !1;
                        }
                    })(e, t, n) || (t.startsWith("__internal_") ? this.applyInternalAttribute(e, t.substring(11), n) : null !== n ? e.setAttribute(t, n) : e.removeAttribute(t));
                }
                applyInternalAttribute(e, t, n) {
                    if (t.startsWith("stopPropagation_")) {
                        const o = Se(t.substring(16));
                        this.eventDelegator.setStopPropagation(e, o, null !== n);
                    } else {
                        if (!t.startsWith("preventDefault_")) throw new Error(`Unsupported internal attribute '${t}'`);
                        {
                            const o = Se(t.substring(15));
                            this.eventDelegator.setPreventDefault(e, o, null !== n);
                        }
                    }
                }
            }
            function ye(e, t) {
                e[ge] = t;
            }
            function we(e) {
                return e[ge];
            }
            function be(e, t) {
                e[me] = t;
            }
            function _e(e, t) {
                const n = e.frameReader;
                switch (n.frameType(t)) {
                    case o.component:
                    case o.element:
                    case o.region:
                        return n.subtreeLength(t) - 1;
                    default:
                        return 0;
                }
            }
            function Se(e) {
                if (e.startsWith("on")) return e.substring(2);
                throw new Error(`Attribute should be an event name, but doesn't start with 'on'. Value: '${e}'`);
            }
            const Ce = {};
            let Ee,
                Ie,
                ke,
                Te,
                Re = !1;
            function Ae(e, t, n, o) {
                let r = Ce[e];
                r || ((r = new ve(e)), (Ce[e] = r)), r.attachRootComponentToLogicalElement(n, t, o);
            }
            function De(e) {
                return Ce[e];
            }
            function xe(e, t) {
                const n = Ce[e];
                if (!n) throw new Error(`There is no browser renderer with ID ${e}.`);
                const o = t.arrayRangeReader,
                    r = t.updatedComponents(),
                    i = o.values(r),
                    s = o.count(r),
                    a = t.referenceFrames(),
                    c = o.values(a),
                    l = t.diffReader;
                for (let e = 0; e < s; e++) {
                    const o = t.updatedComponentsEntry(i, e),
                        r = l.componentId(o),
                        s = l.edits(o);
                    n.updateComponent(t, r, s, c);
                }
                const h = t.disposedComponentIds(),
                    d = o.values(h),
                    u = o.count(h);
                for (let e = 0; e < u; e++) {
                    const o = t.disposedComponentIdsEntry(d, e);
                    n.disposeComponent(o);
                }
                const p = t.disposedEventHandlerIds(),
                    f = o.values(p),
                    g = o.count(p);
                for (let e = 0; e < g; e++) {
                    const o = t.disposedEventHandlerIdsEntry(f, e);
                    n.disposeEventHandler(o);
                }
                Re && ((Re = !1), window.scrollTo && window.scrollTo(0, 0));
            }
            function Ne(e, t) {
                if (
                    0 !== e.button ||
                    (function (e) {
                        return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
                    })(e)
                )
                    return;
                if (e.defaultPrevented) return;
                const n = (function (e) {
                    const t = e.composedPath && e.composedPath();
                    if (t)
                        for (let e = 0; e < t.length; e++) {
                            const n = t[e];
                            if (n instanceof HTMLAnchorElement || n instanceof SVGAElement) return n;
                        }
                    return null;
                })(e);
                if (
                    n &&
                    (function (e) {
                        const t = e.getAttribute("target");
                        return (!t || "_self" === t) && e.hasAttribute("href") && !e.hasAttribute("download");
                    })(n)
                ) {
                    const o = Le(n.getAttribute("href"));
                    Me(o) && (e.preventDefault(), t(o));
                }
            }
            function Me(e) {
                const t = (n = document.baseURI).substring(0, n.lastIndexOf("/"));
                var n;
                const o = e.charAt(t.length);
                return e.startsWith(t) && ("" === o || "/" === o || "?" === o || "#" === o);
            }
            function Pe() {
                return void 0 !== Ie;
            }
            function Ue(e, t) {
                if (!Ie) throw new Error("No enhanced programmatic navigation handler has been attached");
                Ie(e, t);
            }
            function Le(e) {
                return (Te = Te || document.createElement("a")), (Te.href = e), Te.href;
            }
            function Be() {
                return void 0 !== Ee;
            }
            function Oe() {
                return Ee;
            }
            let Fe = !1,
                $e = 0,
                He = 0;
            const We = new Map();
            let je = async function (e) {
                    var t, n, o;
                    Ye();
                    const r = tt();
                    if (null == r ? void 0 : r.hasLocationChangingEventListeners) {
                        const i = null !== (n = null === (t = e.state) || void 0 === t ? void 0 : t._index) && void 0 !== n ? n : 0,
                            s = null === (o = e.state) || void 0 === o ? void 0 : o.userState,
                            a = i - $e,
                            c = location.href;
                        if ((await Ge(-a), !(await Qe(c, s, !1, r)))) return;
                        await Ge(a);
                    }
                    await Ze(!1);
                },
                ze = null;
            const qe = {
                listenForNavigationEvents: function (e, t, n) {
                    var o, r;
                    We.set(e, { rendererId: e, hasLocationChangingEventListeners: !1, locationChanged: t, locationChanging: n }),
                        Fe ||
                            ((Fe = !0),
                            window.addEventListener("popstate", et),
                            ($e = null !== (r = null === (o = history.state) || void 0 === o ? void 0 : o._index) && void 0 !== r ? r : 0),
                            (ke = (e, t) => {
                                Ze(t, e);
                            }));
                },
                enableNavigationInterception: function (e) {
                    if (void 0 !== Ee && Ee !== e) throw new Error("Only one interactive runtime may enable navigation interception at a time.");
                    Ee = e;
                },
                setHasLocationChangingListeners: function (e, t) {
                    const n = We.get(e);
                    if (!n) throw new Error(`Renderer with ID '${e}' is not listening for navigation events`);
                    n.hasLocationChangingEventListeners = t;
                },
                endLocationChanging: function (e, t) {
                    ze && e === He && (ze(t), (ze = null));
                },
                navigateTo: function (e, t) {
                    Ke(e, t, !0);
                },
                refresh: function (e) {
                    !e && Pe() ? Ue(location.href, !0) : location.reload();
                },
                getBaseURI: () => document.baseURI,
                getLocationHref: () => location.href,
                scrollToElement: Je,
            };
            function Je(e) {
                const t = document.getElementById(e);
                return !!t && (t.scrollIntoView(), !0);
            }
            function Ke(e, t, n = !1) {
                const o = Le(e);
                !t.forceLoad && Me(o)
                    ? nt()
                        ? Ve(o, !1, t.replaceHistoryEntry, t.historyEntryState, n)
                        : Ue(o, t.replaceHistoryEntry)
                    : (function (e, t) {
                          if (location.href === e) {
                              const t = e + "?";
                              history.replaceState(null, "", t), location.replace(e);
                          } else t ? location.replace(e) : (location.href = e);
                      })(e, t.replaceHistoryEntry);
            }
            async function Ve(e, t, n, o = void 0, r = !1) {
                if (
                    (Ye(),
                    (function (e) {
                        const t = e.indexOf("#");
                        return t > -1 && location.href.replace(location.hash, "") === e.substring(0, t);
                    })(e))
                )
                    return void (function (e, t, n) {
                        Xe(e, t, n);
                        const o = e.indexOf("#");
                        o !== e.length - 1 && Je(e.substring(o + 1));
                    })(e, n, o);
                const i = tt();
                (r || !(null == i ? void 0 : i.hasLocationChangingEventListeners) || (await Qe(e, o, t, i))) && ((Re = !0), Xe(e, n, o), await Ze(t));
            }
            function Xe(e, t, n = void 0) {
                t ? history.replaceState({ userState: n, _index: $e }, "", e) : ($e++, history.pushState({ userState: n, _index: $e }, "", e));
            }
            function Ge(e) {
                return new Promise((t) => {
                    const n = je;
                    (je = () => {
                        (je = n), t();
                    }),
                        history.go(e);
                });
            }
            function Ye() {
                ze && (ze(!1), (ze = null));
            }
            function Qe(e, t, n, o) {
                return new Promise((r) => {
                    Ye(), He++, (ze = r), o.locationChanging(He, e, t, n);
                });
            }
            async function Ze(e, t) {
                const n = null != t ? t : location.href;
                await Promise.all(
                    Array.from(We, async ([t, o]) => {
                        var r;
                        T(t) && (await o.locationChanged(n, null === (r = history.state) || void 0 === r ? void 0 : r.userState, e));
                    })
                );
            }
            async function et(e) {
                var t, n;
                je && nt() && (await je(e)), ($e = null !== (n = null === (t = history.state) || void 0 === t ? void 0 : t._index) && void 0 !== n ? n : 0);
            }
            function tt() {
                const e = Oe();
                if (void 0 !== e) return We.get(e);
            }
            function nt() {
                return Be() || !Pe();
            }
            const ot = {
                    focus: function (e, t) {
                        if (e instanceof HTMLElement) e.focus({ preventScroll: t });
                        else {
                            if (!(e instanceof SVGElement)) throw new Error("Unable to focus an invalid element.");
                            if (!e.hasAttribute("tabindex")) throw new Error("Unable to focus an SVG element that does not have a tabindex.");
                            e.focus({ preventScroll: t });
                        }
                    },
                    focusBySelector: function (e, t) {
                        const n = document.querySelector(e);
                        n && (n.hasAttribute("tabindex") || (n.tabIndex = -1), n.focus({ preventScroll: !0 }));
                    },
                },
                rt = {
                    init: function (e, t, n, o = 50) {
                        const r = st(t);
                        (r || document.documentElement).style.overflowAnchor = "none";
                        const i = document.createRange();
                        u(n.parentElement) && ((t.style.display = "table-row"), (n.style.display = "table-row"));
                        const s = new IntersectionObserver(
                            function (o) {
                                o.forEach((o) => {
                                    var r;
                                    if (!o.isIntersecting) return;
                                    i.setStartAfter(t), i.setEndBefore(n);
                                    const s = i.getBoundingClientRect().height,
                                        a = null === (r = o.rootBounds) || void 0 === r ? void 0 : r.height;
                                    o.target === t
                                        ? e.invokeMethodAsync("OnSpacerBeforeVisible", o.intersectionRect.top - o.boundingClientRect.top, s, a)
                                        : o.target === n && n.offsetHeight > 0 && e.invokeMethodAsync("OnSpacerAfterVisible", o.boundingClientRect.bottom - o.intersectionRect.bottom, s, a);
                                });
                            },
                            { root: r, rootMargin: `${o}px` }
                        );
                        s.observe(t), s.observe(n);
                        const a = d(t),
                            c = d(n),
                            { observersByDotNetObjectId: l, id: h } = at(e);
                        function d(e) {
                            const t = { attributes: !0 },
                                n = new MutationObserver((n, o) => {
                                    u(e.parentElement) && (o.disconnect(), (e.style.display = "table-row"), o.observe(e, t)), s.unobserve(e), s.observe(e);
                                });
                            return n.observe(e, t), n;
                        }
                        function u(e) {
                            return (
                                null !== e &&
                                ((e instanceof HTMLTableElement && "" === e.style.display) || "table" === e.style.display || (e instanceof HTMLTableSectionElement && "" === e.style.display) || "table-row-group" === e.style.display)
                            );
                        }
                        l[h] = { intersectionObserver: s, mutationObserverBefore: a, mutationObserverAfter: c };
                    },
                    dispose: function (e) {
                        const { observersByDotNetObjectId: t, id: n } = at(e),
                            o = t[n];
                        o && (o.intersectionObserver.disconnect(), o.mutationObserverBefore.disconnect(), o.mutationObserverAfter.disconnect(), e.dispose(), delete t[n]);
                    },
                },
                it = Symbol();
            function st(e) {
                return e && e !== document.body && e !== document.documentElement ? ("visible" !== getComputedStyle(e).overflowY ? e : st(e.parentElement)) : null;
            }
            function at(e) {
                var t;
                const n = e._callDispatcher,
                    o = e._id;
                return (null !== (t = n[it]) && void 0 !== t) || (n[it] = {}), { observersByDotNetObjectId: n[it], id: o };
            }
            const ct = {
                    getAndRemoveExistingTitle: function () {
                        var e;
                        const t = document.head ? document.head.getElementsByTagName("title") : [];
                        if (0 === t.length) return null;
                        let n = null;
                        for (let o = t.length - 1; o >= 0; o--) {
                            const r = t[o],
                                i = r.previousSibling;
                            (i instanceof Comment && null !== K(i)) || (null === n && (n = r.textContent), null === (e = r.parentNode) || void 0 === e || e.removeChild(r));
                        }
                        return n;
                    },
                },
                lt = {
                    init: function (e, t) {
                        (t._blazorInputFileNextFileId = 0),
                            t.addEventListener("click", function () {
                                t.value = "";
                            }),
                            t.addEventListener("change", function () {
                                t._blazorFilesById = {};
                                const n = Array.prototype.map.call(t.files, function (e) {
                                    const n = { id: ++t._blazorInputFileNextFileId, lastModified: new Date(e.lastModified).toISOString(), name: e.name, size: e.size, contentType: e.type, readPromise: void 0, arrayBuffer: void 0, blob: e };
                                    return (t._blazorFilesById[n.id] = n), n;
                                });
                                e.invokeMethodAsync("NotifyChange", n);
                            });
                    },
                    toImageFile: async function (e, t, n, o, r) {
                        const i = ht(e, t),
                            s = await new Promise(function (e) {
                                const t = new Image();
                                (t.onload = function () {
                                    URL.revokeObjectURL(t.src), e(t);
                                }),
                                    (t.onerror = function () {
                                        (t.onerror = null), URL.revokeObjectURL(t.src);
                                    }),
                                    (t.src = URL.createObjectURL(i.blob));
                            }),
                            a = await new Promise(function (e) {
                                var t;
                                const i = Math.min(1, o / s.width),
                                    a = Math.min(1, r / s.height),
                                    c = Math.min(i, a),
                                    l = document.createElement("canvas");
                                (l.width = Math.round(s.width * c)), (l.height = Math.round(s.height * c)), null === (t = l.getContext("2d")) || void 0 === t || t.drawImage(s, 0, 0, l.width, l.height), l.toBlob(e, n);
                            }),
                            c = { id: ++e._blazorInputFileNextFileId, lastModified: i.lastModified, name: i.name, size: (null == a ? void 0 : a.size) || 0, contentType: n, blob: a || i.blob };
                        return (e._blazorFilesById[c.id] = c), c;
                    },
                    readFileData: async function (e, t) {
                        return ht(e, t).blob;
                    },
                };
            function ht(e, t) {
                const n = e._blazorFilesById[t];
                if (!n) throw new Error(`There is no file with ID ${t}. The file list may have changed. See https://aka.ms/aspnet/blazor-input-file-multiple-selections.`);
                return n;
            }
            const dt = new Set(),
                ut = {
                    enableNavigationPrompt: function (e) {
                        0 === dt.size && window.addEventListener("beforeunload", pt), dt.add(e);
                    },
                    disableNavigationPrompt: function (e) {
                        dt.delete(e), 0 === dt.size && window.removeEventListener("beforeunload", pt);
                    },
                };
            function pt(e) {
                e.preventDefault(), (e.returnValue = !0);
            }
            async function ft(e, t, n) {
                return e instanceof Blob
                    ? await (async function (e, t, n) {
                          const o = e.slice(t, t + n),
                              r = await o.arrayBuffer();
                          return new Uint8Array(r);
                      })(e, t, n)
                    : (function (e, t, n) {
                          return new Uint8Array(e.buffer, e.byteOffset + t, n);
                      })(e, t, n);
            }
            const gt = new Map(),
                mt = {
                    navigateTo: function (e, t, n = !1) {
                        Ke(e, t instanceof Object ? t : { forceLoad: t, replaceHistoryEntry: n });
                    },
                    registerCustomEventType: function (e, t) {
                        if (!t) throw new Error("The options parameter is required.");
                        if (i.has(e)) throw new Error(`The event '${e}' is already registered.`);
                        if (t.browserEventName) {
                            const n = s.get(t.browserEventName);
                            n ? n.push(e) : s.set(t.browserEventName, [e]), a.forEach((n) => n(e, t.browserEventName));
                        }
                        i.set(e, t);
                    },
                    rootComponents: y,
                    runtime: {},
                    _internal: { navigationManager: qe, domWrapper: ot, Virtualize: rt, PageTitle: ct, InputFile: lt, NavigationLock: ut, getJSDataStreamChunk: ft, attachWebRendererInterop: k },
                };
            var vt;
            (window.Blazor = mt),
                (function (e) {
                    (e[(e.Trace = 0)] = "Trace"),
                        (e[(e.Debug = 1)] = "Debug"),
                        (e[(e.Information = 2)] = "Information"),
                        (e[(e.Warning = 3)] = "Warning"),
                        (e[(e.Error = 4)] = "Error"),
                        (e[(e.Critical = 5)] = "Critical"),
                        (e[(e.None = 6)] = "None");
                })(vt || (vt = {}));
            class yt {
                log(e, t) {}
            }
            yt.instance = new yt();
            class wt {
                constructor(e) {
                    this.minLevel = e;
                }
                log(e, t) {
                    if (e >= this.minLevel) {
                        const n = `[${new Date().toISOString()}] ${vt[e]}: ${t}`;
                        switch (e) {
                            case vt.Critical:
                            case vt.Error:
                                console.error(n);
                                break;
                            case vt.Warning:
                                console.warn(n);
                                break;
                            case vt.Information:
                                console.info(n);
                                break;
                            default:
                                console.log(n);
                        }
                    }
                }
            }
            function bt(e, t) {
                switch (t) {
                    case "webassembly":
                        return kt(e, "webassembly");
                    case "server":
                        return (function (e) {
                            return kt(e, "server").sort((e, t) => e.sequence - t.sequence);
                        })(e);
                    case "auto":
                        return kt(e, "auto");
                }
            }
            const _t = /^\s*Blazor-Server-Component-State:(?<state>[a-zA-Z0-9+/=]+)$/,
                St = /^\s*Blazor-WebAssembly-Component-State:(?<state>[a-zA-Z0-9+/=]+)$/,
                Ct = /^\s*Blazor-Web-Initializers:(?<initializers>[a-zA-Z0-9+/=]+)$/;
            function Et(e) {
                return It(e, _t);
            }
            function It(e, t, n = "state") {
                var o;
                if (e.nodeType === Node.COMMENT_NODE) {
                    const r = e.textContent || "",
                        i = t.exec(r),
                        s = i && i.groups && i.groups[n];
                    return s && (null === (o = e.parentNode) || void 0 === o || o.removeChild(e)), s;
                }
                if (!e.hasChildNodes()) return;
                const r = e.childNodes;
                for (let e = 0; e < r.length; e++) {
                    const o = It(r[e], t, n);
                    if (o) return o;
                }
            }
            function kt(e, t) {
                const n = [],
                    o = new Mt(e.childNodes);
                for (; o.next() && o.currentElement; ) {
                    const e = Rt(o, t);
                    if (e) n.push(e);
                    else if (o.currentElement.hasChildNodes()) {
                        const e = kt(o.currentElement, t);
                        for (let t = 0; t < e.length; t++) {
                            const o = e[t];
                            n.push(o);
                        }
                    }
                }
                return n;
            }
            const Tt = new RegExp(/^\s*Blazor:[^{]*(?<descriptor>.*)$/);
            function Rt(e, t) {
                const n = e.currentElement;
                var o, r, i;
                if (n && n.nodeType === Node.COMMENT_NODE && n.textContent) {
                    const s = Tt.exec(n.textContent),
                        a = s && s.groups && s.groups.descriptor;
                    if (!a) return;
                    !(function (e) {
                        if (e.parentNode instanceof Document) throw new Error("Root components cannot be marked as interactive. The <html> element must be rendered statically so that scripts are not evaluated multiple times.");
                    })(n);
                    try {
                        const s = (function (e) {
                                const t = JSON.parse(e),
                                    { type: n } = t;
                                if ("server" !== n && "webassembly" !== n && "auto" !== n) throw new Error(`Invalid component type '${n}'.`);
                                return t;
                            })(a),
                            c = (function (e, t, n) {
                                const { prerenderId: o } = e;
                                if (o) {
                                    for (; n.next() && n.currentElement; ) {
                                        const e = n.currentElement;
                                        if (e.nodeType !== Node.COMMENT_NODE) continue;
                                        if (!e.textContent) continue;
                                        const t = Tt.exec(e.textContent),
                                            r = t && t[1];
                                        if (r) return Nt(r, o), e;
                                    }
                                    throw new Error(`Could not find an end component comment for '${t}'.`);
                                }
                            })(s, n, e);
                        if (t !== s.type) return;
                        switch (s.type) {
                            case "webassembly":
                                return (r = n), (i = c), xt((o = s)), { ...o, uniqueId: At++, start: r, end: i };
                            case "server":
                                return (function (e, t, n) {
                                    return Dt(e), { ...e, uniqueId: At++, start: t, end: n };
                                })(s, n, c);
                            case "auto":
                                return (function (e, t, n) {
                                    return Dt(e), xt(e), { ...e, uniqueId: At++, start: t, end: n };
                                })(s, n, c);
                        }
                    } catch (e) {
                        throw new Error(`Found malformed component comment at ${n.textContent}`);
                    }
                }
            }
            let At = 0;
            function Dt(e) {
                const { descriptor: t, sequence: n } = e;
                if (!t) throw new Error("descriptor must be defined when using a descriptor.");
                if (void 0 === n) throw new Error("sequence must be defined when using a descriptor.");
                if (!Number.isInteger(n)) throw new Error(`Error parsing the sequence '${n}' for component '${JSON.stringify(e)}'`);
            }
            function xt(e) {
                const { assembly: t, typeName: n } = e;
                if (!t) throw new Error("assembly must be defined when using a descriptor.");
                if (!n) throw new Error("typeName must be defined when using a descriptor.");
                (e.parameterDefinitions = e.parameterDefinitions && atob(e.parameterDefinitions)), (e.parameterValues = e.parameterValues && atob(e.parameterValues));
            }
            function Nt(e, t) {
                const n = JSON.parse(e);
                if (1 !== Object.keys(n).length) throw new Error(`Invalid end of component comment: '${e}'`);
                const o = n.prerenderId;
                if (!o) throw new Error(`End of component comment must have a value for the prerendered property: '${e}'`);
                if (o !== t) throw new Error(`End of component comment prerendered property must match the start comment prerender id: '${t}', '${o}'`);
            }
            class Mt {
                constructor(e) {
                    (this.childNodes = e), (this.currentIndex = -1), (this.length = e.length);
                }
                next() {
                    return this.currentIndex++, this.currentIndex < this.length ? ((this.currentElement = this.childNodes[this.currentIndex]), !0) : ((this.currentElement = void 0), !1);
                }
            }
            function Pt(e) {
                return { ...e, start: void 0, end: void 0 };
            }
            function Ut(e, t) {
                return e.type === t.type && ((n = e.key), (o = t.key), !(!n || !o) && n.locationHash === o.locationHash && n.formattedComponentKey === o.formattedComponentKey);
                var n, o;
            }
            class Lt {
                static write(e) {
                    return `${e}${Lt.RecordSeparator}`;
                }
                static parse(e) {
                    if (e[e.length - 1] !== Lt.RecordSeparator) throw new Error("Message is incomplete.");
                    const t = e.split(Lt.RecordSeparator);
                    return t.pop(), t;
                }
            }
            var Bt;
            (Lt.RecordSeparatorCode = 30),
                (Lt.RecordSeparator = String.fromCharCode(Lt.RecordSeparatorCode)),
                (function (e) {
                    (e[(e.Trace = 0)] = "Trace"),
                        (e[(e.Debug = 1)] = "Debug"),
                        (e[(e.Information = 2)] = "Information"),
                        (e[(e.Warning = 3)] = "Warning"),
                        (e[(e.Error = 4)] = "Error"),
                        (e[(e.Critical = 5)] = "Critical"),
                        (e[(e.None = 6)] = "None");
                })(Bt || (Bt = {}));
            class Ot {
                constructor() {}
                log(e, t) {}
            }
            Ot.instance = new Ot();
            const Ft = "0.0.0-DEV_BUILD";
            class $t {
                static isRequired(e, t) {
                    if (null == e) throw new Error(`The '${t}' argument is required.`);
                }
                static isNotEmpty(e, t) {
                    if (!e || e.match(/^\s*$/)) throw new Error(`The '${t}' argument should not be empty.`);
                }
                static isIn(e, t, n) {
                    if (!(e in t)) throw new Error(`Unknown ${n} value: ${e}.`);
                }
            }
            class Ht {
                static get isBrowser() {
                    return !Ht.isNode && "object" == typeof window && "object" == typeof window.document;
                }
                static get isWebWorker() {
                    return !Ht.isNode && "object" == typeof self && "importScripts" in self;
                }
                static get isReactNative() {
                    return !Ht.isNode && "object" == typeof window && void 0 === window.document;
                }
                static get isNode() {
                    return "undefined" != typeof process && process.release && "node" === process.release.name;
                }
            }
            function Wt(e, t) {
                let n = "";
                return (
                    jt(e)
                        ? ((n = `Binary data of length ${e.byteLength}`),
                          t &&
                              (n += `. Content: '${(function (e) {
                                  const t = new Uint8Array(e);
                                  let n = "";
                                  return (
                                      t.forEach((e) => {
                                          n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
                                      }),
                                      n.substr(0, n.length - 1)
                                  );
                              })(e)}'`))
                        : "string" == typeof e && ((n = `String data of length ${e.length}`), t && (n += `. Content: '${e}'`)),
                    n
                );
            }
            function jt(e) {
                return e && "undefined" != typeof ArrayBuffer && (e instanceof ArrayBuffer || (e.constructor && "ArrayBuffer" === e.constructor.name));
            }
            async function zt(e, t, n, o, r, i) {
                const s = {},
                    [a, c] = Kt();
                (s[a] = c), e.log(Bt.Trace, `(${t} transport) sending data. ${Wt(r, i.logMessageContent)}.`);
                const l = jt(r) ? "arraybuffer" : "text",
                    h = await n.post(o, { content: r, headers: { ...s, ...i.headers }, responseType: l, timeout: i.timeout, withCredentials: i.withCredentials });
                e.log(Bt.Trace, `(${t} transport) request complete. Response status: ${h.statusCode}.`);
            }
            class qt {
                constructor(e, t) {
                    (this._subject = e), (this._observer = t);
                }
                dispose() {
                    const e = this._subject.observers.indexOf(this._observer);
                    e > -1 && this._subject.observers.splice(e, 1), 0 === this._subject.observers.length && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
                }
            }
            class Jt {
                constructor(e) {
                    (this._minLevel = e), (this.out = console);
                }
                log(e, t) {
                    if (e >= this._minLevel) {
                        const n = `[${new Date().toISOString()}] ${Bt[e]}: ${t}`;
                        switch (e) {
                            case Bt.Critical:
                            case Bt.Error:
                                this.out.error(n);
                                break;
                            case Bt.Warning:
                                this.out.warn(n);
                                break;
                            case Bt.Information:
                                this.out.info(n);
                                break;
                            default:
                                this.out.log(n);
                        }
                    }
                }
            }
            function Kt() {
                let e = "X-SignalR-User-Agent";
                return Ht.isNode && (e = "User-Agent"), [e, Vt(Ft, Xt(), Ht.isNode ? "NodeJS" : "Browser", Gt())];
            }
            function Vt(e, t, n, o) {
                let r = "Microsoft SignalR/";
                const i = e.split(".");
                return (r += `${i[0]}.${i[1]}`), (r += ` (${e}; `), (r += t && "" !== t ? `${t}; ` : "Unknown OS; "), (r += `${n}`), (r += o ? `; ${o}` : "; Unknown Runtime Version"), (r += ")"), r;
            }
            function Xt() {
                if (!Ht.isNode) return "";
                switch (process.platform) {
                    case "win32":
                        return "Windows NT";
                    case "darwin":
                        return "macOS";
                    case "linux":
                        return "Linux";
                    default:
                        return process.platform;
                }
            }
            function Gt() {
                if (Ht.isNode) return process.versions.node;
            }
            function Yt(e) {
                return e.stack ? e.stack : e.message ? e.message : `${e}`;
            }
            class Qt {
                writeHandshakeRequest(e) {
                    return Lt.write(JSON.stringify(e));
                }
                parseHandshakeResponse(e) {
                    let t, n;
                    if (jt(e)) {
                        const o = new Uint8Array(e),
                            r = o.indexOf(Lt.RecordSeparatorCode);
                        if (-1 === r) throw new Error("Message is incomplete.");
                        const i = r + 1;
                        (t = String.fromCharCode.apply(null, Array.prototype.slice.call(o.slice(0, i)))), (n = o.byteLength > i ? o.slice(i).buffer : null);
                    } else {
                        const o = e,
                            r = o.indexOf(Lt.RecordSeparator);
                        if (-1 === r) throw new Error("Message is incomplete.");
                        const i = r + 1;
                        (t = o.substring(0, i)), (n = o.length > i ? o.substring(i) : null);
                    }
                    const o = Lt.parse(t),
                        r = JSON.parse(o[0]);
                    if (r.type) throw new Error("Expected a handshake response from the server.");
                    return [n, r];
                }
            }
            class Zt extends Error {
                constructor(e, t) {
                    const n = new.target.prototype;
                    super(`${e}: Status code '${t}'`), (this.statusCode = t), (this.__proto__ = n);
                }
            }
            class en extends Error {
                constructor(e = "A timeout occurred.") {
                    const t = new.target.prototype;
                    super(e), (this.__proto__ = t);
                }
            }
            class tn extends Error {
                constructor(e = "An abort occurred.") {
                    const t = new.target.prototype;
                    super(e), (this.__proto__ = t);
                }
            }
            class nn extends Error {
                constructor(e, t) {
                    const n = new.target.prototype;
                    super(e), (this.transport = t), (this.errorType = "UnsupportedTransportError"), (this.__proto__ = n);
                }
            }
            class on extends Error {
                constructor(e, t) {
                    const n = new.target.prototype;
                    super(e), (this.transport = t), (this.errorType = "DisabledTransportError"), (this.__proto__ = n);
                }
            }
            class rn extends Error {
                constructor(e, t) {
                    const n = new.target.prototype;
                    super(e), (this.transport = t), (this.errorType = "FailedToStartTransportError"), (this.__proto__ = n);
                }
            }
            class sn extends Error {
                constructor(e) {
                    const t = new.target.prototype;
                    super(e), (this.errorType = "FailedToNegotiateWithServerError"), (this.__proto__ = t);
                }
            }
            class an extends Error {
                constructor(e, t) {
                    const n = new.target.prototype;
                    super(e), (this.innerErrors = t), (this.__proto__ = n);
                }
            }
            var cn, ln;
            !(function (e) {
                (e[(e.Invocation = 1)] = "Invocation"),
                    (e[(e.StreamItem = 2)] = "StreamItem"),
                    (e[(e.Completion = 3)] = "Completion"),
                    (e[(e.StreamInvocation = 4)] = "StreamInvocation"),
                    (e[(e.CancelInvocation = 5)] = "CancelInvocation"),
                    (e[(e.Ping = 6)] = "Ping"),
                    (e[(e.Close = 7)] = "Close"),
                    (e[(e.Ack = 8)] = "Ack"),
                    (e[(e.Sequence = 9)] = "Sequence");
            })(cn || (cn = {}));
            class hn {
                constructor() {
                    this.observers = [];
                }
                next(e) {
                    for (const t of this.observers) t.next(e);
                }
                error(e) {
                    for (const t of this.observers) t.error && t.error(e);
                }
                complete() {
                    for (const e of this.observers) e.complete && e.complete();
                }
                subscribe(e) {
                    return this.observers.push(e), new qt(this, e);
                }
            }
            class dn {
                constructor(e, t, n) {
                    (this._bufferSize = 1e5),
                        (this._messages = []),
                        (this._totalMessageCount = 0),
                        (this._waitForSequenceMessage = !1),
                        (this._nextReceivingSequenceId = 1),
                        (this._latestReceivedSequenceId = 0),
                        (this._bufferedByteCount = 0),
                        (this._reconnectInProgress = !1),
                        (this._protocol = e),
                        (this._connection = t),
                        (this._bufferSize = n);
                }
                async _send(e) {
                    const t = this._protocol.writeMessage(e);
                    let n = Promise.resolve();
                    if (this._isInvocationMessage(e)) {
                        this._totalMessageCount++;
                        let e = () => {},
                            o = () => {};
                        jt(t) ? (this._bufferedByteCount += t.byteLength) : (this._bufferedByteCount += t.length),
                            this._bufferedByteCount >= this._bufferSize &&
                                (n = new Promise((t, n) => {
                                    (e = t), (o = n);
                                })),
                            this._messages.push(new un(t, this._totalMessageCount, e, o));
                    }
                    try {
                        this._reconnectInProgress || (await this._connection.send(t));
                    } catch {
                        this._disconnected();
                    }
                    await n;
                }
                _ack(e) {
                    let t = -1;
                    for (let n = 0; n < this._messages.length; n++) {
                        const o = this._messages[n];
                        if (o._id <= e.sequenceId) (t = n), jt(o._message) ? (this._bufferedByteCount -= o._message.byteLength) : (this._bufferedByteCount -= o._message.length), o._resolver();
                        else {
                            if (!(this._bufferedByteCount < this._bufferSize)) break;
                            o._resolver();
                        }
                    }
                    -1 !== t && (this._messages = this._messages.slice(t + 1));
                }
                _shouldProcessMessage(e) {
                    if (this._waitForSequenceMessage) return e.type === cn.Sequence && ((this._waitForSequenceMessage = !1), !0);
                    if (!this._isInvocationMessage(e)) return !0;
                    const t = this._nextReceivingSequenceId;
                    return this._nextReceivingSequenceId++, t <= this._latestReceivedSequenceId ? (t === this._latestReceivedSequenceId && this._ackTimer(), !1) : ((this._latestReceivedSequenceId = t), this._ackTimer(), !0);
                }
                _resetSequence(e) {
                    e.sequenceId > this._nextReceivingSequenceId ? this._connection.stop(new Error("Sequence ID greater than amount of messages we've received.")) : (this._nextReceivingSequenceId = e.sequenceId);
                }
                _disconnected() {
                    (this._reconnectInProgress = !0), (this._waitForSequenceMessage = !0);
                }
                async _resend() {
                    const e = 0 !== this._messages.length ? this._messages[0]._id : this._totalMessageCount + 1;
                    await this._connection.send(this._protocol.writeMessage({ type: cn.Sequence, sequenceId: e }));
                    const t = this._messages;
                    for (const e of t) await this._connection.send(e._message);
                    this._reconnectInProgress = !1;
                }
                _dispose(e) {
                    null != e || (e = new Error("Unable to reconnect to server."));
                    for (const t of this._messages) t._rejector(e);
                }
                _isInvocationMessage(e) {
                    switch (e.type) {
                        case cn.Invocation:
                        case cn.StreamItem:
                        case cn.Completion:
                        case cn.StreamInvocation:
                        case cn.CancelInvocation:
                            return !0;
                        case cn.Close:
                        case cn.Sequence:
                        case cn.Ping:
                        case cn.Ack:
                            return !1;
                    }
                }
                _ackTimer() {
                    void 0 === this._ackTimerHandle &&
                        (this._ackTimerHandle = setTimeout(async () => {
                            try {
                                this._reconnectInProgress || (await this._connection.send(this._protocol.writeMessage({ type: cn.Ack, sequenceId: this._latestReceivedSequenceId })));
                            } catch {}
                            clearTimeout(this._ackTimerHandle), (this._ackTimerHandle = void 0);
                        }, 1e3));
                }
            }
            class un {
                constructor(e, t, n, o) {
                    (this._message = e), (this._id = t), (this._resolver = n), (this._rejector = o);
                }
            }
            !(function (e) {
                (e.Disconnected = "Disconnected"), (e.Connecting = "Connecting"), (e.Connected = "Connected"), (e.Disconnecting = "Disconnecting"), (e.Reconnecting = "Reconnecting");
            })(ln || (ln = {}));
            class pn {
                static create(e, t, n, o, r, i, s) {
                    return new pn(e, t, n, o, r, i, s);
                }
                constructor(e, t, n, o, r, i, s) {
                    (this._nextKeepAlive = 0),
                        (this._freezeEventListener = () => {
                            this._logger.log(
                                Bt.Warning,
                                "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep"
                            );
                        }),
                        $t.isRequired(e, "connection"),
                        $t.isRequired(t, "logger"),
                        $t.isRequired(n, "protocol"),
                        (this.serverTimeoutInMilliseconds = null != r ? r : 3e4),
                        (this.keepAliveIntervalInMilliseconds = null != i ? i : 15e3),
                        (this._statefulReconnectBufferSize = null != s ? s : 1e5),
                        (this._logger = t),
                        (this._protocol = n),
                        (this.connection = e),
                        (this._reconnectPolicy = o),
                        (this._handshakeProtocol = new Qt()),
                        (this.connection.onreceive = (e) => this._processIncomingData(e)),
                        (this.connection.onclose = (e) => this._connectionClosed(e)),
                        (this._callbacks = {}),
                        (this._methods = {}),
                        (this._closedCallbacks = []),
                        (this._reconnectingCallbacks = []),
                        (this._reconnectedCallbacks = []),
                        (this._invocationId = 0),
                        (this._receivedHandshakeResponse = !1),
                        (this._connectionState = ln.Disconnected),
                        (this._connectionStarted = !1),
                        (this._cachedPingMessage = this._protocol.writeMessage({ type: cn.Ping }));
                }
                get state() {
                    return this._connectionState;
                }
                get connectionId() {
                    return (this.connection && this.connection.connectionId) || null;
                }
                get baseUrl() {
                    return this.connection.baseUrl || "";
                }
                set baseUrl(e) {
                    if (this._connectionState !== ln.Disconnected && this._connectionState !== ln.Reconnecting) throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
                    if (!e) throw new Error("The HubConnection url must be a valid url.");
                    this.connection.baseUrl = e;
                }
                start() {
                    return (this._startPromise = this._startWithStateTransitions()), this._startPromise;
                }
                async _startWithStateTransitions() {
                    if (this._connectionState !== ln.Disconnected) return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
                    (this._connectionState = ln.Connecting), this._logger.log(Bt.Debug, "Starting HubConnection.");
                    try {
                        await this._startInternal(),
                            Ht.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener),
                            (this._connectionState = ln.Connected),
                            (this._connectionStarted = !0),
                            this._logger.log(Bt.Debug, "HubConnection connected successfully.");
                    } catch (e) {
                        return (this._connectionState = ln.Disconnected), this._logger.log(Bt.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
                    }
                }
                async _startInternal() {
                    (this._stopDuringStartError = void 0), (this._receivedHandshakeResponse = !1);
                    const e = new Promise((e, t) => {
                        (this._handshakeResolver = e), (this._handshakeRejecter = t);
                    });
                    await this.connection.start(this._protocol.transferFormat);
                    try {
                        let t = this._protocol.version;
                        this.connection.features.reconnect || (t = 1);
                        const n = { protocol: this._protocol.name, version: t };
                        if (
                            (this._logger.log(Bt.Debug, "Sending handshake request."),
                            await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)),
                            this._logger.log(Bt.Information, `Using HubProtocol '${this._protocol.name}'.`),
                            this._cleanupTimeout(),
                            this._resetTimeoutPeriod(),
                            this._resetKeepAliveInterval(),
                            await e,
                            this._stopDuringStartError)
                        )
                            throw this._stopDuringStartError;
                        !!this.connection.features.reconnect &&
                            ((this._messageBuffer = new dn(this._protocol, this.connection, this._statefulReconnectBufferSize)),
                            (this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer)),
                            (this.connection.features.resend = () => {
                                if (this._messageBuffer) return this._messageBuffer._resend();
                            })),
                            this.connection.features.inherentKeepAlive || (await this._sendMessage(this._cachedPingMessage));
                    } catch (e) {
                        throw (this._logger.log(Bt.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e);
                    }
                }
                async stop() {
                    const e = this._startPromise;
                    (this.connection.features.reconnect = !1), (this._stopPromise = this._stopInternal()), await this._stopPromise;
                    try {
                        await e;
                    } catch (e) {}
                }
                _stopInternal(e) {
                    if (this._connectionState === ln.Disconnected) return this._logger.log(Bt.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
                    if (this._connectionState === ln.Disconnecting) return this._logger.log(Bt.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
                    const t = this._connectionState;
                    return (
                        (this._connectionState = ln.Disconnecting),
                        this._logger.log(Bt.Debug, "Stopping HubConnection."),
                        this._reconnectDelayHandle
                            ? (this._logger.log(Bt.Debug, "Connection stopped during reconnect delay. Done reconnecting."),
                              clearTimeout(this._reconnectDelayHandle),
                              (this._reconnectDelayHandle = void 0),
                              this._completeClose(),
                              Promise.resolve())
                            : (t === ln.Connected && this._sendCloseMessage(),
                              this._cleanupTimeout(),
                              this._cleanupPingTimer(),
                              (this._stopDuringStartError = e || new tn("The connection was stopped before the hub handshake could complete.")),
                              this.connection.stop(e))
                    );
                }
                async _sendCloseMessage() {
                    try {
                        await this._sendWithProtocol(this._createCloseMessage());
                    } catch {}
                }
                stream(e, ...t) {
                    const [n, o] = this._replaceStreamingParams(t),
                        r = this._createStreamInvocation(e, t, o);
                    let i;
                    const s = new hn();
                    return (
                        (s.cancelCallback = () => {
                            const e = this._createCancelInvocation(r.invocationId);
                            return delete this._callbacks[r.invocationId], i.then(() => this._sendWithProtocol(e));
                        }),
                        (this._callbacks[r.invocationId] = (e, t) => {
                            t ? s.error(t) : e && (e.type === cn.Completion ? (e.error ? s.error(new Error(e.error)) : s.complete()) : s.next(e.item));
                        }),
                        (i = this._sendWithProtocol(r).catch((e) => {
                            s.error(e), delete this._callbacks[r.invocationId];
                        })),
                        this._launchStreams(n, i),
                        s
                    );
                }
                _sendMessage(e) {
                    return this._resetKeepAliveInterval(), this.connection.send(e);
                }
                _sendWithProtocol(e) {
                    return this._messageBuffer ? this._messageBuffer._send(e) : this._sendMessage(this._protocol.writeMessage(e));
                }
                send(e, ...t) {
                    const [n, o] = this._replaceStreamingParams(t),
                        r = this._sendWithProtocol(this._createInvocation(e, t, !0, o));
                    return this._launchStreams(n, r), r;
                }
                invoke(e, ...t) {
                    const [n, o] = this._replaceStreamingParams(t),
                        r = this._createInvocation(e, t, !1, o);
                    return new Promise((e, t) => {
                        this._callbacks[r.invocationId] = (n, o) => {
                            o ? t(o) : n && (n.type === cn.Completion ? (n.error ? t(new Error(n.error)) : e(n.result)) : t(new Error(`Unexpected message type: ${n.type}`)));
                        };
                        const o = this._sendWithProtocol(r).catch((e) => {
                            t(e), delete this._callbacks[r.invocationId];
                        });
                        this._launchStreams(n, o);
                    });
                }
                on(e, t) {
                    e && t && ((e = e.toLowerCase()), this._methods[e] || (this._methods[e] = []), -1 === this._methods[e].indexOf(t) && this._methods[e].push(t));
                }
                off(e, t) {
                    if (!e) return;
                    e = e.toLowerCase();
                    const n = this._methods[e];
                    if (n)
                        if (t) {
                            const o = n.indexOf(t);
                            -1 !== o && (n.splice(o, 1), 0 === n.length && delete this._methods[e]);
                        } else delete this._methods[e];
                }
                onclose(e) {
                    e && this._closedCallbacks.push(e);
                }
                onreconnecting(e) {
                    e && this._reconnectingCallbacks.push(e);
                }
                onreconnected(e) {
                    e && this._reconnectedCallbacks.push(e);
                }
                _processIncomingData(e) {
                    if ((this._cleanupTimeout(), this._receivedHandshakeResponse || ((e = this._processHandshakeResponse(e)), (this._receivedHandshakeResponse = !0)), e)) {
                        const t = this._protocol.parseMessages(e, this._logger);
                        for (const e of t)
                            if (!this._messageBuffer || this._messageBuffer._shouldProcessMessage(e))
                                switch (e.type) {
                                    case cn.Invocation:
                                        this._invokeClientMethod(e).catch((e) => {
                                            this._logger.log(Bt.Error, `Invoke client method threw error: ${Yt(e)}`);
                                        });
                                        break;
                                    case cn.StreamItem:
                                    case cn.Completion: {
                                        const t = this._callbacks[e.invocationId];
                                        if (t) {
                                            e.type === cn.Completion && delete this._callbacks[e.invocationId];
                                            try {
                                                t(e);
                                            } catch (e) {
                                                this._logger.log(Bt.Error, `Stream callback threw error: ${Yt(e)}`);
                                            }
                                        }
                                        break;
                                    }
                                    case cn.Ping:
                                        break;
                                    case cn.Close: {
                                        this._logger.log(Bt.Information, "Close message received from server.");
                                        const t = e.error ? new Error("Server returned an error on close: " + e.error) : void 0;
                                        !0 === e.allowReconnect ? this.connection.stop(t) : (this._stopPromise = this._stopInternal(t));
                                        break;
                                    }
                                    case cn.Ack:
                                        this._messageBuffer && this._messageBuffer._ack(e);
                                        break;
                                    case cn.Sequence:
                                        this._messageBuffer && this._messageBuffer._resetSequence(e);
                                        break;
                                    default:
                                        this._logger.log(Bt.Warning, `Invalid message type: ${e.type}.`);
                                }
                    }
                    this._resetTimeoutPeriod();
                }
                _processHandshakeResponse(e) {
                    let t, n;
                    try {
                        [n, t] = this._handshakeProtocol.parseHandshakeResponse(e);
                    } catch (e) {
                        const t = "Error parsing handshake response: " + e;
                        this._logger.log(Bt.Error, t);
                        const n = new Error(t);
                        throw (this._handshakeRejecter(n), n);
                    }
                    if (t.error) {
                        const e = "Server returned handshake error: " + t.error;
                        this._logger.log(Bt.Error, e);
                        const n = new Error(e);
                        throw (this._handshakeRejecter(n), n);
                    }
                    return this._logger.log(Bt.Debug, "Server handshake complete."), this._handshakeResolver(), n;
                }
                _resetKeepAliveInterval() {
                    this.connection.features.inherentKeepAlive || ((this._nextKeepAlive = new Date().getTime() + this.keepAliveIntervalInMilliseconds), this._cleanupPingTimer());
                }
                _resetTimeoutPeriod() {
                    if (!((this.connection.features && this.connection.features.inherentKeepAlive) || ((this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds)), void 0 !== this._pingServerHandle))) {
                        let e = this._nextKeepAlive - new Date().getTime();
                        e < 0 && (e = 0),
                            (this._pingServerHandle = setTimeout(async () => {
                                if (this._connectionState === ln.Connected)
                                    try {
                                        await this._sendMessage(this._cachedPingMessage);
                                    } catch {
                                        this._cleanupPingTimer();
                                    }
                            }, e));
                    }
                }
                serverTimeout() {
                    this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
                }
                async _invokeClientMethod(e) {
                    const t = e.target.toLowerCase(),
                        n = this._methods[t];
                    if (!n)
                        return (
                            this._logger.log(Bt.Warning, `No client method with the name '${t}' found.`),
                            void (
                                e.invocationId &&
                                (this._logger.log(Bt.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`),
                                await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)))
                            )
                        );
                    const o = n.slice(),
                        r = !!e.invocationId;
                    let i, s, a;
                    for (const n of o)
                        try {
                            const o = i;
                            (i = await n.apply(this, e.arguments)),
                                r && i && o && (this._logger.log(Bt.Error, `Multiple results provided for '${t}'. Sending error to server.`), (a = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null))),
                                (s = void 0);
                        } catch (e) {
                            (s = e), this._logger.log(Bt.Error, `A callback for the method '${t}' threw error '${e}'.`);
                        }
                    a
                        ? await this._sendWithProtocol(a)
                        : r
                        ? (s
                              ? (a = this._createCompletionMessage(e.invocationId, `${s}`, null))
                              : void 0 !== i
                              ? (a = this._createCompletionMessage(e.invocationId, null, i))
                              : (this._logger.log(Bt.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), (a = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null))),
                          await this._sendWithProtocol(a))
                        : i && this._logger.log(Bt.Error, `Result given for '${t}' method but server is not expecting a result.`);
                }
                _connectionClosed(e) {
                    this._logger.log(Bt.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`),
                        (this._stopDuringStartError = this._stopDuringStartError || e || new tn("The underlying connection was closed before the hub handshake could complete.")),
                        this._handshakeResolver && this._handshakeResolver(),
                        this._cancelCallbacksWithError(e || new Error("Invocation canceled due to the underlying connection being closed.")),
                        this._cleanupTimeout(),
                        this._cleanupPingTimer(),
                        this._connectionState === ln.Disconnecting
                            ? this._completeClose(e)
                            : this._connectionState === ln.Connected && this._reconnectPolicy
                            ? this._reconnect(e)
                            : this._connectionState === ln.Connected && this._completeClose(e);
                }
                _completeClose(e) {
                    if (this._connectionStarted) {
                        (this._connectionState = ln.Disconnected),
                            (this._connectionStarted = !1),
                            this._messageBuffer && (this._messageBuffer._dispose(null != e ? e : new Error("Connection closed.")), (this._messageBuffer = void 0)),
                            Ht.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
                        try {
                            this._closedCallbacks.forEach((t) => t.apply(this, [e]));
                        } catch (t) {
                            this._logger.log(Bt.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
                        }
                    }
                }
                async _reconnect(e) {
                    const t = Date.now();
                    let n = 0,
                        o = void 0 !== e ? e : new Error("Attempting to reconnect due to a unknown error."),
                        r = this._getNextRetryDelay(n++, 0, o);
                    if (null === r) return this._logger.log(Bt.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), void this._completeClose(e);
                    if (
                        ((this._connectionState = ln.Reconnecting),
                        e ? this._logger.log(Bt.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(Bt.Information, "Connection reconnecting."),
                        0 !== this._reconnectingCallbacks.length)
                    ) {
                        try {
                            this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
                        } catch (t) {
                            this._logger.log(Bt.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
                        }
                        if (this._connectionState !== ln.Reconnecting) return void this._logger.log(Bt.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                    }
                    for (; null !== r; ) {
                        if (
                            (this._logger.log(Bt.Information, `Reconnect attempt number ${n} will start in ${r} ms.`),
                            await new Promise((e) => {
                                this._reconnectDelayHandle = setTimeout(e, r);
                            }),
                            (this._reconnectDelayHandle = void 0),
                            this._connectionState !== ln.Reconnecting)
                        )
                            return void this._logger.log(Bt.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                        try {
                            if ((await this._startInternal(), (this._connectionState = ln.Connected), this._logger.log(Bt.Information, "HubConnection reconnected successfully."), 0 !== this._reconnectedCallbacks.length))
                                try {
                                    this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
                                } catch (e) {
                                    this._logger.log(Bt.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
                                }
                            return;
                        } catch (e) {
                            if ((this._logger.log(Bt.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== ln.Reconnecting))
                                return (
                                    this._logger.log(Bt.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`),
                                    void (this._connectionState === ln.Disconnecting && this._completeClose())
                                );
                            (o = e instanceof Error ? e : new Error(e.toString())), (r = this._getNextRetryDelay(n++, Date.now() - t, o));
                        }
                    }
                    this._logger.log(Bt.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
                }
                _getNextRetryDelay(e, t, n) {
                    try {
                        return this._reconnectPolicy.nextRetryDelayInMilliseconds({ elapsedMilliseconds: t, previousRetryCount: e, retryReason: n });
                    } catch (n) {
                        return this._logger.log(Bt.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
                    }
                }
                _cancelCallbacksWithError(e) {
                    const t = this._callbacks;
                    (this._callbacks = {}),
                        Object.keys(t).forEach((n) => {
                            const o = t[n];
                            try {
                                o(null, e);
                            } catch (t) {
                                this._logger.log(Bt.Error, `Stream 'error' callback called with '${e}' threw error: ${Yt(t)}`);
                            }
                        });
                }
                _cleanupPingTimer() {
                    this._pingServerHandle && (clearTimeout(this._pingServerHandle), (this._pingServerHandle = void 0));
                }
                _cleanupTimeout() {
                    this._timeoutHandle && clearTimeout(this._timeoutHandle);
                }
                _createInvocation(e, t, n, o) {
                    if (n) return 0 !== o.length ? { target: e, arguments: t, streamIds: o, type: cn.Invocation } : { target: e, arguments: t, type: cn.Invocation };
                    {
                        const n = this._invocationId;
                        return this._invocationId++, 0 !== o.length ? { target: e, arguments: t, invocationId: n.toString(), streamIds: o, type: cn.Invocation } : { target: e, arguments: t, invocationId: n.toString(), type: cn.Invocation };
                    }
                }
                _launchStreams(e, t) {
                    if (0 !== e.length) {
                        t || (t = Promise.resolve());
                        for (const n in e)
                            e[n].subscribe({
                                complete: () => {
                                    t = t.then(() => this._sendWithProtocol(this._createCompletionMessage(n)));
                                },
                                error: (e) => {
                                    let o;
                                    (o = e instanceof Error ? e.message : e && e.toString ? e.toString() : "Unknown error"), (t = t.then(() => this._sendWithProtocol(this._createCompletionMessage(n, o))));
                                },
                                next: (e) => {
                                    t = t.then(() => this._sendWithProtocol(this._createStreamItemMessage(n, e)));
                                },
                            });
                    }
                }
                _replaceStreamingParams(e) {
                    const t = [],
                        n = [];
                    for (let o = 0; o < e.length; o++) {
                        const r = e[o];
                        if (this._isObservable(r)) {
                            const i = this._invocationId;
                            this._invocationId++, (t[i] = r), n.push(i.toString()), e.splice(o, 1);
                        }
                    }
                    return [t, n];
                }
                _isObservable(e) {
                    return e && e.subscribe && "function" == typeof e.subscribe;
                }
                _createStreamInvocation(e, t, n) {
                    const o = this._invocationId;
                    return (
                        this._invocationId++,
                        0 !== n.length ? { target: e, arguments: t, invocationId: o.toString(), streamIds: n, type: cn.StreamInvocation } : { target: e, arguments: t, invocationId: o.toString(), type: cn.StreamInvocation }
                    );
                }
                _createCancelInvocation(e) {
                    return { invocationId: e, type: cn.CancelInvocation };
                }
                _createStreamItemMessage(e, t) {
                    return { invocationId: e, item: t, type: cn.StreamItem };
                }
                _createCompletionMessage(e, t, n) {
                    return t ? { error: t, invocationId: e, type: cn.Completion } : { invocationId: e, result: n, type: cn.Completion };
                }
                _createCloseMessage() {
                    return { type: cn.Close };
                }
            }
            const fn = [0, 2e3, 1e4, 3e4, null];
            class gn {
                constructor(e) {
                    this._retryDelays = void 0 !== e ? [...e, null] : fn;
                }
                nextRetryDelayInMilliseconds(e) {
                    return this._retryDelays[e.previousRetryCount];
                }
            }
            class mn {}
            (mn.Authorization = "Authorization"), (mn.Cookie = "Cookie");
            class vn {
                constructor(e, t, n) {
                    (this.statusCode = e), (this.statusText = t), (this.content = n);
                }
            }
            class yn {
                get(e, t) {
                    return this.send({ ...t, method: "GET", url: e });
                }
                post(e, t) {
                    return this.send({ ...t, method: "POST", url: e });
                }
                delete(e, t) {
                    return this.send({ ...t, method: "DELETE", url: e });
                }
                getCookieString(e) {
                    return "";
                }
            }
            class wn extends yn {
                constructor(e, t) {
                    super(), (this._innerClient = e), (this._accessTokenFactory = t);
                }
                async send(e) {
                    let t = !0;
                    this._accessTokenFactory && (!this._accessToken || (e.url && e.url.indexOf("/negotiate?") > 0)) && ((t = !1), (this._accessToken = await this._accessTokenFactory())), this._setAuthorizationHeader(e);
                    const n = await this._innerClient.send(e);
                    return t && 401 === n.statusCode && this._accessTokenFactory ? ((this._accessToken = await this._accessTokenFactory()), this._setAuthorizationHeader(e), await this._innerClient.send(e)) : n;
                }
                _setAuthorizationHeader(e) {
                    e.headers || (e.headers = {}), this._accessToken ? (e.headers[mn.Authorization] = `Bearer ${this._accessToken}`) : this._accessTokenFactory && e.headers[mn.Authorization] && delete e.headers[mn.Authorization];
                }
                getCookieString(e) {
                    return this._innerClient.getCookieString(e);
                }
            }
            class bn extends yn {
                constructor(e) {
                    super(), (this._logger = e);
                    const t = { _fetchType: void 0, _jar: void 0 };
                    var o;
                    (o = t),
                        "undefined" == typeof fetch && ((o._jar = new (n(628).CookieJar)()), "undefined" == typeof fetch ? (o._fetchType = n(200)) : (o._fetchType = fetch), (o._fetchType = n(203)(o._fetchType, o._jar)), 1)
                            ? ((this._fetchType = t._fetchType), (this._jar = t._jar))
                            : (this._fetchType = fetch.bind(
                                  (function () {
                                      if ("undefined" != typeof globalThis) return globalThis;
                                      if ("undefined" != typeof self) return self;
                                      if ("undefined" != typeof window) return window;
                                      if (void 0 !== n.g) return n.g;
                                      throw new Error("could not find global");
                                  })()
                              )),
                        (this._abortControllerType = AbortController);
                    const r = { _abortControllerType: this._abortControllerType };
                    (function (e) {
                        return "undefined" == typeof AbortController && ((e._abortControllerType = n(778)), !0);
                    })(r) && (this._abortControllerType = r._abortControllerType);
                }
                async send(e) {
                    if (e.abortSignal && e.abortSignal.aborted) throw new tn();
                    if (!e.method) throw new Error("No method defined.");
                    if (!e.url) throw new Error("No url defined.");
                    const t = new this._abortControllerType();
                    let n;
                    e.abortSignal &&
                        (e.abortSignal.onabort = () => {
                            t.abort(), (n = new tn());
                        });
                    let o,
                        r = null;
                    if (e.timeout) {
                        const o = e.timeout;
                        r = setTimeout(() => {
                            t.abort(), this._logger.log(Bt.Warning, "Timeout from HTTP request."), (n = new en());
                        }, o);
                    }
                    "" === e.content && (e.content = void 0), e.content && ((e.headers = e.headers || {}), jt(e.content) ? (e.headers["Content-Type"] = "application/octet-stream") : (e.headers["Content-Type"] = "text/plain;charset=UTF-8"));
                    try {
                        o = await this._fetchType(e.url, {
                            body: e.content,
                            cache: "no-cache",
                            credentials: !0 === e.withCredentials ? "include" : "same-origin",
                            headers: { "X-Requested-With": "XMLHttpRequest", ...e.headers },
                            method: e.method,
                            mode: "cors",
                            redirect: "follow",
                            signal: t.signal,
                        });
                    } catch (e) {
                        if (n) throw n;
                        throw (this._logger.log(Bt.Warning, `Error from HTTP request. ${e}.`), e);
                    } finally {
                        r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
                    }
                    if (!o.ok) {
                        const e = await _n(o, "text");
                        throw new Zt(e || o.statusText, o.status);
                    }
                    const i = _n(o, e.responseType),
                        s = await i;
                    return new vn(o.status, o.statusText, s);
                }
                getCookieString(e) {
                    return "";
                }
            }
            function _n(e, t) {
                let n;
                switch (t) {
                    case "arraybuffer":
                        n = e.arrayBuffer();
                        break;
                    case "text":
                    default:
                        n = e.text();
                        break;
                    case "blob":
                    case "document":
                    case "json":
                        throw new Error(`${t} is not supported.`);
                }
                return n;
            }
            class Sn extends yn {
                constructor(e) {
                    super(), (this._logger = e);
                }
                send(e) {
                    return e.abortSignal && e.abortSignal.aborted
                        ? Promise.reject(new tn())
                        : e.method
                        ? e.url
                            ? new Promise((t, n) => {
                                  const o = new XMLHttpRequest();
                                  o.open(e.method, e.url, !0),
                                      (o.withCredentials = void 0 === e.withCredentials || e.withCredentials),
                                      o.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
                                      "" === e.content && (e.content = void 0),
                                      e.content && (jt(e.content) ? o.setRequestHeader("Content-Type", "application/octet-stream") : o.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
                                  const r = e.headers;
                                  r &&
                                      Object.keys(r).forEach((e) => {
                                          o.setRequestHeader(e, r[e]);
                                      }),
                                      e.responseType && (o.responseType = e.responseType),
                                      e.abortSignal &&
                                          (e.abortSignal.onabort = () => {
                                              o.abort(), n(new tn());
                                          }),
                                      e.timeout && (o.timeout = e.timeout),
                                      (o.onload = () => {
                                          e.abortSignal && (e.abortSignal.onabort = null),
                                              o.status >= 200 && o.status < 300 ? t(new vn(o.status, o.statusText, o.response || o.responseText)) : n(new Zt(o.response || o.responseText || o.statusText, o.status));
                                      }),
                                      (o.onerror = () => {
                                          this._logger.log(Bt.Warning, `Error from HTTP request. ${o.status}: ${o.statusText}.`), n(new Zt(o.statusText, o.status));
                                      }),
                                      (o.ontimeout = () => {
                                          this._logger.log(Bt.Warning, "Timeout from HTTP request."), n(new en());
                                      }),
                                      o.send(e.content);
                              })
                            : Promise.reject(new Error("No url defined."))
                        : Promise.reject(new Error("No method defined."));
                }
            }
            class Cn extends yn {
                constructor(e) {
                    if ((super(), "undefined" != typeof fetch)) this._httpClient = new bn(e);
                    else {
                        if ("undefined" == typeof XMLHttpRequest) throw new Error("No usable HttpClient found.");
                        this._httpClient = new Sn(e);
                    }
                }
                send(e) {
                    return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new tn()) : e.method ? (e.url ? this._httpClient.send(e) : Promise.reject(new Error("No url defined."))) : Promise.reject(new Error("No method defined."));
                }
                getCookieString(e) {
                    return this._httpClient.getCookieString(e);
                }
            }
            var En, In;
            !(function (e) {
                (e[(e.None = 0)] = "None"), (e[(e.WebSockets = 1)] = "WebSockets"), (e[(e.ServerSentEvents = 2)] = "ServerSentEvents"), (e[(e.LongPolling = 4)] = "LongPolling");
            })(En || (En = {})),
                (function (e) {
                    (e[(e.Text = 1)] = "Text"), (e[(e.Binary = 2)] = "Binary");
                })(In || (In = {}));
            class kn {
                constructor() {
                    (this._isAborted = !1), (this.onabort = null);
                }
                abort() {
                    this._isAborted || ((this._isAborted = !0), this.onabort && this.onabort());
                }
                get signal() {
                    return this;
                }
                get aborted() {
                    return this._isAborted;
                }
            }
            class Tn {
                get pollAborted() {
                    return this._pollAbort.aborted;
                }
                constructor(e, t, n) {
                    (this._httpClient = e), (this._logger = t), (this._pollAbort = new kn()), (this._options = n), (this._running = !1), (this.onreceive = null), (this.onclose = null);
                }
                async connect(e, t) {
                    if (
                        ($t.isRequired(e, "url"),
                        $t.isRequired(t, "transferFormat"),
                        $t.isIn(t, In, "transferFormat"),
                        (this._url = e),
                        this._logger.log(Bt.Trace, "(LongPolling transport) Connecting."),
                        t === In.Binary && "undefined" != typeof XMLHttpRequest && "string" != typeof new XMLHttpRequest().responseType)
                    )
                        throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
                    const [n, o] = Kt(),
                        r = { [n]: o, ...this._options.headers },
                        i = { abortSignal: this._pollAbort.signal, headers: r, timeout: 1e5, withCredentials: this._options.withCredentials };
                    t === In.Binary && (i.responseType = "arraybuffer");
                    const s = `${e}&_=${Date.now()}`;
                    this._logger.log(Bt.Trace, `(LongPolling transport) polling: ${s}.`);
                    const a = await this._httpClient.get(s, i);
                    200 !== a.statusCode
                        ? (this._logger.log(Bt.Error, `(LongPolling transport) Unexpected response code: ${a.statusCode}.`), (this._closeError = new Zt(a.statusText || "", a.statusCode)), (this._running = !1))
                        : (this._running = !0),
                        (this._receiving = this._poll(this._url, i));
                }
                async _poll(e, t) {
                    try {
                        for (; this._running; )
                            try {
                                const n = `${e}&_=${Date.now()}`;
                                this._logger.log(Bt.Trace, `(LongPolling transport) polling: ${n}.`);
                                const o = await this._httpClient.get(n, t);
                                204 === o.statusCode
                                    ? (this._logger.log(Bt.Information, "(LongPolling transport) Poll terminated by server."), (this._running = !1))
                                    : 200 !== o.statusCode
                                    ? (this._logger.log(Bt.Error, `(LongPolling transport) Unexpected response code: ${o.statusCode}.`), (this._closeError = new Zt(o.statusText || "", o.statusCode)), (this._running = !1))
                                    : o.content
                                    ? (this._logger.log(Bt.Trace, `(LongPolling transport) data received. ${Wt(o.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(o.content))
                                    : this._logger.log(Bt.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                            } catch (e) {
                                this._running
                                    ? e instanceof en
                                        ? this._logger.log(Bt.Trace, "(LongPolling transport) Poll timed out, reissuing.")
                                        : ((this._closeError = e), (this._running = !1))
                                    : this._logger.log(Bt.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
                            }
                    } finally {
                        this._logger.log(Bt.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
                    }
                }
                async send(e) {
                    return this._running ? zt(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(new Error("Cannot send until the transport is connected"));
                }
                async stop() {
                    this._logger.log(Bt.Trace, "(LongPolling transport) Stopping polling."), (this._running = !1), this._pollAbort.abort();
                    try {
                        await this._receiving, this._logger.log(Bt.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
                        const e = {},
                            [t, n] = Kt();
                        e[t] = n;
                        const o = { headers: { ...e, ...this._options.headers }, timeout: this._options.timeout, withCredentials: this._options.withCredentials };
                        let r;
                        try {
                            await this._httpClient.delete(this._url, o);
                        } catch (e) {
                            r = e;
                        }
                        r
                            ? r instanceof Zt &&
                              (404 === r.statusCode
                                  ? this._logger.log(Bt.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.")
                                  : this._logger.log(Bt.Trace, `(LongPolling transport) Error sending a DELETE request: ${r}`))
                            : this._logger.log(Bt.Trace, "(LongPolling transport) DELETE request accepted.");
                    } finally {
                        this._logger.log(Bt.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
                    }
                }
                _raiseOnClose() {
                    if (this.onclose) {
                        let e = "(LongPolling transport) Firing onclose event.";
                        this._closeError && (e += " Error: " + this._closeError), this._logger.log(Bt.Trace, e), this.onclose(this._closeError);
                    }
                }
            }
            class Rn {
                constructor(e, t, n, o) {
                    (this._httpClient = e), (this._accessToken = t), (this._logger = n), (this._options = o), (this.onreceive = null), (this.onclose = null);
                }
                async connect(e, t) {
                    return (
                        $t.isRequired(e, "url"),
                        $t.isRequired(t, "transferFormat"),
                        $t.isIn(t, In, "transferFormat"),
                        this._logger.log(Bt.Trace, "(SSE transport) Connecting."),
                        (this._url = e),
                        this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`),
                        new Promise((n, o) => {
                            let r,
                                i = !1;
                            if (t === In.Text) {
                                if (Ht.isBrowser || Ht.isWebWorker) r = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
                                else {
                                    const t = this._httpClient.getCookieString(e),
                                        n = {};
                                    n.Cookie = t;
                                    const [o, i] = Kt();
                                    (n[o] = i), (r = new this._options.EventSource(e, { withCredentials: this._options.withCredentials, headers: { ...n, ...this._options.headers } }));
                                }
                                try {
                                    (r.onmessage = (e) => {
                                        if (this.onreceive)
                                            try {
                                                this._logger.log(Bt.Trace, `(SSE transport) data received. ${Wt(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
                                            } catch (e) {
                                                return void this._close(e);
                                            }
                                    }),
                                        (r.onerror = (e) => {
                                            i
                                                ? this._close()
                                                : o(
                                                      new Error(
                                                          "EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."
                                                      )
                                                  );
                                        }),
                                        (r.onopen = () => {
                                            this._logger.log(Bt.Information, `SSE connected to ${this._url}`), (this._eventSource = r), (i = !0), n();
                                        });
                                } catch (e) {
                                    return void o(e);
                                }
                            } else o(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                        })
                    );
                }
                async send(e) {
                    return this._eventSource ? zt(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(new Error("Cannot send until the transport is connected"));
                }
                stop() {
                    return this._close(), Promise.resolve();
                }
                _close(e) {
                    this._eventSource && (this._eventSource.close(), (this._eventSource = void 0), this.onclose && this.onclose(e));
                }
            }
            class An {
                constructor(e, t, n, o, r, i) {
                    (this._logger = n), (this._accessTokenFactory = t), (this._logMessageContent = o), (this._webSocketConstructor = r), (this._httpClient = e), (this.onreceive = null), (this.onclose = null), (this._headers = i);
                }
                async connect(e, t) {
                    let n;
                    return (
                        $t.isRequired(e, "url"),
                        $t.isRequired(t, "transferFormat"),
                        $t.isIn(t, In, "transferFormat"),
                        this._logger.log(Bt.Trace, "(WebSockets transport) Connecting."),
                        this._accessTokenFactory && (n = await this._accessTokenFactory()),
                        new Promise((o, r) => {
                            let i;
                            e = e.replace(/^http/, "ws");
                            const s = this._httpClient.getCookieString(e);
                            let a = !1;
                            if (Ht.isReactNative) {
                                const t = {},
                                    [o, r] = Kt();
                                (t[o] = r), n && (t[mn.Authorization] = `Bearer ${n}`), s && (t[mn.Cookie] = s), (i = new this._webSocketConstructor(e, void 0, { headers: { ...t, ...this._headers } }));
                            } else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
                            i || (i = new this._webSocketConstructor(e)),
                                t === In.Binary && (i.binaryType = "arraybuffer"),
                                (i.onopen = (t) => {
                                    this._logger.log(Bt.Information, `WebSocket connected to ${e}.`), (this._webSocket = i), (a = !0), o();
                                }),
                                (i.onerror = (e) => {
                                    let t = null;
                                    (t = "undefined" != typeof ErrorEvent && e instanceof ErrorEvent ? e.error : "There was an error with the transport"), this._logger.log(Bt.Information, `(WebSockets transport) ${t}.`);
                                }),
                                (i.onmessage = (e) => {
                                    if ((this._logger.log(Bt.Trace, `(WebSockets transport) data received. ${Wt(e.data, this._logMessageContent)}.`), this.onreceive))
                                        try {
                                            this.onreceive(e.data);
                                        } catch (e) {
                                            return void this._close(e);
                                        }
                                }),
                                (i.onclose = (e) => {
                                    if (a) this._close(e);
                                    else {
                                        let t = null;
                                        (t =
                                            "undefined" != typeof ErrorEvent && e instanceof ErrorEvent
                                                ? e.error
                                                : "WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled."),
                                            r(new Error(t));
                                    }
                                });
                        })
                    );
                }
                send(e) {
                    return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN
                        ? (this._logger.log(Bt.Trace, `(WebSockets transport) sending data. ${Wt(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve())
                        : Promise.reject("WebSocket is not in the OPEN state");
                }
                stop() {
                    return this._webSocket && this._close(void 0), Promise.resolve();
                }
                _close(e) {
                    this._webSocket && ((this._webSocket.onclose = () => {}), (this._webSocket.onmessage = () => {}), (this._webSocket.onerror = () => {}), this._webSocket.close(), (this._webSocket = void 0)),
                        this._logger.log(Bt.Trace, "(WebSockets transport) socket closed."),
                        this.onclose &&
                            (!this._isCloseEvent(e) || (!1 !== e.wasClean && 1e3 === e.code)
                                ? e instanceof Error
                                    ? this.onclose(e)
                                    : this.onclose()
                                : this.onclose(new Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)));
                }
                _isCloseEvent(e) {
                    return e && "boolean" == typeof e.wasClean && "number" == typeof e.code;
                }
            }
            class Dn {
                constructor(e, t = {}) {
                    if (
                        ((this._stopPromiseResolver = () => {}),
                        (this.features = {}),
                        (this._negotiateVersion = 1),
                        $t.isRequired(e, "url"),
                        (this._logger = (function (e) {
                            return void 0 === e ? new Jt(Bt.Information) : null === e ? Ot.instance : void 0 !== e.log ? e : new Jt(e);
                        })(t.logger)),
                        (this.baseUrl = this._resolveUrl(e)),
                        ((t = t || {}).logMessageContent = void 0 !== t.logMessageContent && t.logMessageContent),
                        "boolean" != typeof t.withCredentials && void 0 !== t.withCredentials)
                    )
                        throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
                    (t.withCredentials = void 0 === t.withCredentials || t.withCredentials),
                        (t.timeout = void 0 === t.timeout ? 1e5 : t.timeout),
                        "undefined" == typeof WebSocket || t.WebSocket || (t.WebSocket = WebSocket),
                        "undefined" == typeof EventSource || t.EventSource || (t.EventSource = EventSource),
                        (this._httpClient = new wn(t.httpClient || new Cn(this._logger), t.accessTokenFactory)),
                        (this._connectionState = "Disconnected"),
                        (this._connectionStarted = !1),
                        (this._options = t),
                        (this.onreceive = null),
                        (this.onclose = null);
                }
                async start(e) {
                    if (((e = e || In.Binary), $t.isIn(e, In, "transferFormat"), this._logger.log(Bt.Debug, `Starting connection with transfer format '${In[e]}'.`), "Disconnected" !== this._connectionState))
                        return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
                    if (((this._connectionState = "Connecting"), (this._startInternalPromise = this._startInternal(e)), await this._startInternalPromise, "Disconnecting" === this._connectionState)) {
                        const e = "Failed to start the HttpConnection before stop() was called.";
                        return this._logger.log(Bt.Error, e), await this._stopPromise, Promise.reject(new tn(e));
                    }
                    if ("Connected" !== this._connectionState) {
                        const e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
                        return this._logger.log(Bt.Error, e), Promise.reject(new tn(e));
                    }
                    this._connectionStarted = !0;
                }
                send(e) {
                    return "Connected" !== this._connectionState
                        ? Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."))
                        : (this._sendQueue || (this._sendQueue = new xn(this.transport)), this._sendQueue.send(e));
                }
                async stop(e) {
                    return "Disconnected" === this._connectionState
                        ? (this._logger.log(Bt.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve())
                        : "Disconnecting" === this._connectionState
                        ? (this._logger.log(Bt.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise)
                        : ((this._connectionState = "Disconnecting"),
                          (this._stopPromise = new Promise((e) => {
                              this._stopPromiseResolver = e;
                          })),
                          await this._stopInternal(e),
                          void (await this._stopPromise));
                }
                async _stopInternal(e) {
                    this._stopError = e;
                    try {
                        await this._startInternalPromise;
                    } catch (e) {}
                    if (this.transport) {
                        try {
                            await this.transport.stop();
                        } catch (e) {
                            this._logger.log(Bt.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
                        }
                        this.transport = void 0;
                    } else this._logger.log(Bt.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
                }
                async _startInternal(e) {
                    let t = this.baseUrl;
                    (this._accessTokenFactory = this._options.accessTokenFactory), (this._httpClient._accessTokenFactory = this._accessTokenFactory);
                    try {
                        if (this._options.skipNegotiation) {
                            if (this._options.transport !== En.WebSockets) throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
                            (this.transport = this._constructTransport(En.WebSockets)), await this._startTransport(t, e);
                        } else {
                            let n = null,
                                o = 0;
                            do {
                                if (((n = await this._getNegotiationResponse(t)), "Disconnecting" === this._connectionState || "Disconnected" === this._connectionState)) throw new tn("The connection was stopped during negotiation.");
                                if (n.error) throw new Error(n.error);
                                if (n.ProtocolVersion)
                                    throw new Error(
                                        "Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details."
                                    );
                                if ((n.url && (t = n.url), n.accessToken)) {
                                    const e = n.accessToken;
                                    (this._accessTokenFactory = () => e), (this._httpClient._accessToken = e), (this._httpClient._accessTokenFactory = void 0);
                                }
                                o++;
                            } while (n.url && o < 100);
                            if (100 === o && n.url) throw new Error("Negotiate redirection limit exceeded.");
                            await this._createTransport(t, this._options.transport, n, e);
                        }
                        this.transport instanceof Tn && (this.features.inherentKeepAlive = !0),
                            "Connecting" === this._connectionState && (this._logger.log(Bt.Debug, "The HttpConnection connected successfully."), (this._connectionState = "Connected"));
                    } catch (e) {
                        return this._logger.log(Bt.Error, "Failed to start the connection: " + e), (this._connectionState = "Disconnected"), (this.transport = void 0), this._stopPromiseResolver(), Promise.reject(e);
                    }
                }
                async _getNegotiationResponse(e) {
                    const t = {},
                        [n, o] = Kt();
                    t[n] = o;
                    const r = this._resolveNegotiateUrl(e);
                    this._logger.log(Bt.Debug, `Sending negotiation request: ${r}.`);
                    try {
                        const e = await this._httpClient.post(r, { content: "", headers: { ...t, ...this._options.headers }, timeout: this._options.timeout, withCredentials: this._options.withCredentials });
                        if (200 !== e.statusCode) return Promise.reject(new Error(`Unexpected status code returned from negotiate '${e.statusCode}'`));
                        const n = JSON.parse(e.content);
                        return (
                            (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId),
                            n.useStatefulReconnect && !0 !== this._options._useStatefulReconnect ? Promise.reject(new sn("Client didn't negotiate Stateful Reconnect but the server did.")) : n
                        );
                    } catch (e) {
                        let t = "Failed to complete negotiation with the server: " + e;
                        return e instanceof Zt && 404 === e.statusCode && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(Bt.Error, t), Promise.reject(new sn(t));
                    }
                }
                _createConnectUrl(e, t) {
                    return t ? e + (-1 === e.indexOf("?") ? "?" : "&") + `id=${t}` : e;
                }
                async _createTransport(e, t, n, o) {
                    let r = this._createConnectUrl(e, n.connectionToken);
                    if (this._isITransport(t))
                        return this._logger.log(Bt.Debug, "Connection was provided an instance of ITransport, using that directly."), (this.transport = t), await this._startTransport(r, o), void (this.connectionId = n.connectionId);
                    const i = [],
                        s = n.availableTransports || [];
                    let a = n;
                    for (const n of s) {
                        const s = this._resolveTransportOrError(n, t, o, !0 === (null == a ? void 0 : a.useStatefulReconnect));
                        if (s instanceof Error) i.push(`${n.transport} failed:`), i.push(s);
                        else if (this._isITransport(s)) {
                            if (((this.transport = s), !a)) {
                                try {
                                    a = await this._getNegotiationResponse(e);
                                } catch (e) {
                                    return Promise.reject(e);
                                }
                                r = this._createConnectUrl(e, a.connectionToken);
                            }
                            try {
                                return await this._startTransport(r, o), void (this.connectionId = a.connectionId);
                            } catch (e) {
                                if (
                                    (this._logger.log(Bt.Error, `Failed to start the transport '${n.transport}': ${e}`), (a = void 0), i.push(new rn(`${n.transport} failed: ${e}`, En[n.transport])), "Connecting" !== this._connectionState)
                                ) {
                                    const e = "Failed to select transport before stop() was called.";
                                    return this._logger.log(Bt.Debug, e), Promise.reject(new tn(e));
                                }
                            }
                        }
                    }
                    return i.length > 0
                        ? Promise.reject(new an(`Unable to connect to the server with any of the available transports. ${i.join(" ")}`, i))
                        : Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
                }
                _constructTransport(e) {
                    switch (e) {
                        case En.WebSockets:
                            if (!this._options.WebSocket) throw new Error("'WebSocket' is not supported in your environment.");
                            return new An(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
                        case En.ServerSentEvents:
                            if (!this._options.EventSource) throw new Error("'EventSource' is not supported in your environment.");
                            return new Rn(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
                        case En.LongPolling:
                            return new Tn(this._httpClient, this._logger, this._options);
                        default:
                            throw new Error(`Unknown transport: ${e}.`);
                    }
                }
                _startTransport(e, t) {
                    return (
                        (this.transport.onreceive = this.onreceive),
                        this.features.reconnect
                            ? (this.transport.onclose = async (n) => {
                                  let o = !1;
                                  if (this.features.reconnect) {
                                      try {
                                          this.features.disconnected(), await this.transport.connect(e, t), await this.features.resend();
                                      } catch {
                                          o = !0;
                                      }
                                      o && this._stopConnection(n);
                                  } else this._stopConnection(n);
                              })
                            : (this.transport.onclose = (e) => this._stopConnection(e)),
                        this.transport.connect(e, t)
                    );
                }
                _resolveTransportOrError(e, t, n, o) {
                    const r = En[e.transport];
                    if (null == r)
                        return this._logger.log(Bt.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), new Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
                    if (
                        !(function (e, t) {
                            return !e || 0 != (t & e);
                        })(t, r)
                    )
                        return this._logger.log(Bt.Debug, `Skipping transport '${En[r]}' because it was disabled by the client.`), new on(`'${En[r]}' is disabled by the client.`, r);
                    if (!(e.transferFormats.map((e) => In[e]).indexOf(n) >= 0))
                        return this._logger.log(Bt.Debug, `Skipping transport '${En[r]}' because it does not support the requested transfer format '${In[n]}'.`), new Error(`'${En[r]}' does not support ${In[n]}.`);
                    if ((r === En.WebSockets && !this._options.WebSocket) || (r === En.ServerSentEvents && !this._options.EventSource))
                        return this._logger.log(Bt.Debug, `Skipping transport '${En[r]}' because it is not supported in your environment.'`), new nn(`'${En[r]}' is not supported in your environment.`, r);
                    this._logger.log(Bt.Debug, `Selecting transport '${En[r]}'.`);
                    try {
                        return (this.features.reconnect = r === En.WebSockets ? o : void 0), this._constructTransport(r);
                    } catch (e) {
                        return e;
                    }
                }
                _isITransport(e) {
                    return e && "object" == typeof e && "connect" in e;
                }
                _stopConnection(e) {
                    if (
                        (this._logger.log(Bt.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`),
                        (this.transport = void 0),
                        (e = this._stopError || e),
                        (this._stopError = void 0),
                        "Disconnected" !== this._connectionState)
                    ) {
                        if ("Connecting" === this._connectionState)
                            throw (
                                (this._logger.log(Bt.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`),
                                new Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`))
                            );
                        if (
                            ("Disconnecting" === this._connectionState && this._stopPromiseResolver(),
                            e ? this._logger.log(Bt.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(Bt.Information, "Connection disconnected."),
                            this._sendQueue &&
                                (this._sendQueue.stop().catch((e) => {
                                    this._logger.log(Bt.Error, `TransportSendQueue.stop() threw error '${e}'.`);
                                }),
                                (this._sendQueue = void 0)),
                            (this.connectionId = void 0),
                            (this._connectionState = "Disconnected"),
                            this._connectionStarted)
                        ) {
                            this._connectionStarted = !1;
                            try {
                                this.onclose && this.onclose(e);
                            } catch (t) {
                                this._logger.log(Bt.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
                            }
                        }
                    } else this._logger.log(Bt.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
                }
                _resolveUrl(e) {
                    if (0 === e.lastIndexOf("https://", 0) || 0 === e.lastIndexOf("http://", 0)) return e;
                    if (!Ht.isBrowser) throw new Error(`Cannot resolve '${e}'.`);
                    const t = window.document.createElement("a");
                    return (t.href = e), this._logger.log(Bt.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
                }
                _resolveNegotiateUrl(e) {
                    const t = new URL(e);
                    t.pathname.endsWith("/") ? (t.pathname += "negotiate") : (t.pathname += "/negotiate");
                    const n = new URLSearchParams(t.searchParams);
                    return (
                        n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()),
                        n.has("useStatefulReconnect") ? "true" === n.get("useStatefulReconnect") && (this._options._useStatefulReconnect = !0) : !0 === this._options._useStatefulReconnect && n.append("useStatefulReconnect", "true"),
                        (t.search = n.toString()),
                        t.toString()
                    );
                }
            }
            class xn {
                constructor(e) {
                    (this._transport = e), (this._buffer = []), (this._executing = !0), (this._sendBufferedData = new Nn()), (this._transportResult = new Nn()), (this._sendLoopPromise = this._sendLoop());
                }
                send(e) {
                    return this._bufferData(e), this._transportResult || (this._transportResult = new Nn()), this._transportResult.promise;
                }
                stop() {
                    return (this._executing = !1), this._sendBufferedData.resolve(), this._sendLoopPromise;
                }
                _bufferData(e) {
                    if (this._buffer.length && typeof this._buffer[0] != typeof e) throw new Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof e}`);
                    this._buffer.push(e), this._sendBufferedData.resolve();
                }
                async _sendLoop() {
                    for (;;) {
                        if ((await this._sendBufferedData.promise, !this._executing)) {
                            this._transportResult && this._transportResult.reject("Connection stopped.");
                            break;
                        }
                        this._sendBufferedData = new Nn();
                        const e = this._transportResult;
                        this._transportResult = void 0;
                        const t = "string" == typeof this._buffer[0] ? this._buffer.join("") : xn._concatBuffers(this._buffer);
                        this._buffer.length = 0;
                        try {
                            await this._transport.send(t), e.resolve();
                        } catch (t) {
                            e.reject(t);
                        }
                    }
                }
                static _concatBuffers(e) {
                    const t = e.map((e) => e.byteLength).reduce((e, t) => e + t),
                        n = new Uint8Array(t);
                    let o = 0;
                    for (const t of e) n.set(new Uint8Array(t), o), (o += t.byteLength);
                    return n.buffer;
                }
            }
            class Nn {
                constructor() {
                    this.promise = new Promise((e, t) => ([this._resolver, this._rejecter] = [e, t]));
                }
                resolve() {
                    this._resolver();
                }
                reject(e) {
                    this._rejecter(e);
                }
            }
            class Mn {
                constructor() {
                    (this.name = "json"), (this.version = 2), (this.transferFormat = In.Text);
                }
                parseMessages(e, t) {
                    if ("string" != typeof e) throw new Error("Invalid input for JSON hub protocol. Expected a string.");
                    if (!e) return [];
                    null === t && (t = Ot.instance);
                    const n = Lt.parse(e),
                        o = [];
                    for (const e of n) {
                        const n = JSON.parse(e);
                        if ("number" != typeof n.type) throw new Error("Invalid payload.");
                        switch (n.type) {
                            case cn.Invocation:
                                this._isInvocationMessage(n);
                                break;
                            case cn.StreamItem:
                                this._isStreamItemMessage(n);
                                break;
                            case cn.Completion:
                                this._isCompletionMessage(n);
                                break;
                            case cn.Ping:
                            case cn.Close:
                                break;
                            case cn.Ack:
                                this._isAckMessage(n);
                                break;
                            case cn.Sequence:
                                this._isSequenceMessage(n);
                                break;
                            default:
                                t.log(Bt.Information, "Unknown message type '" + n.type + "' ignored.");
                                continue;
                        }
                        o.push(n);
                    }
                    return o;
                }
                writeMessage(e) {
                    return Lt.write(JSON.stringify(e));
                }
                _isInvocationMessage(e) {
                    this._assertNotEmptyString(e.target, "Invalid payload for Invocation message."), void 0 !== e.invocationId && this._assertNotEmptyString(e.invocationId, "Invalid payload for Invocation message.");
                }
                _isStreamItemMessage(e) {
                    if ((this._assertNotEmptyString(e.invocationId, "Invalid payload for StreamItem message."), void 0 === e.item)) throw new Error("Invalid payload for StreamItem message.");
                }
                _isCompletionMessage(e) {
                    if (e.result && e.error) throw new Error("Invalid payload for Completion message.");
                    !e.result && e.error && this._assertNotEmptyString(e.error, "Invalid payload for Completion message."), this._assertNotEmptyString(e.invocationId, "Invalid payload for Completion message.");
                }
                _isAckMessage(e) {
                    if ("number" != typeof e.sequenceId) throw new Error("Invalid SequenceId for Ack message.");
                }
                _isSequenceMessage(e) {
                    if ("number" != typeof e.sequenceId) throw new Error("Invalid SequenceId for Sequence message.");
                }
                _assertNotEmptyString(e, t) {
                    if ("string" != typeof e || "" === e) throw new Error(t);
                }
            }
            const Pn = { trace: Bt.Trace, debug: Bt.Debug, info: Bt.Information, information: Bt.Information, warn: Bt.Warning, warning: Bt.Warning, error: Bt.Error, critical: Bt.Critical, none: Bt.None };
            class Un {
                configureLogging(e) {
                    if (
                        ($t.isRequired(e, "logging"),
                        (function (e) {
                            return void 0 !== e.log;
                        })(e))
                    )
                        this.logger = e;
                    else if ("string" == typeof e) {
                        const t = (function (e) {
                            const t = Pn[e.toLowerCase()];
                            if (void 0 !== t) return t;
                            throw new Error(`Unknown log level: ${e}`);
                        })(e);
                        this.logger = new Jt(t);
                    } else this.logger = new Jt(e);
                    return this;
                }
                withUrl(e, t) {
                    return (
                        $t.isRequired(e, "url"), $t.isNotEmpty(e, "url"), (this.url = e), (this.httpConnectionOptions = "object" == typeof t ? { ...this.httpConnectionOptions, ...t } : { ...this.httpConnectionOptions, transport: t }), this
                    );
                }
                withHubProtocol(e) {
                    return $t.isRequired(e, "protocol"), (this.protocol = e), this;
                }
                withAutomaticReconnect(e) {
                    if (this.reconnectPolicy) throw new Error("A reconnectPolicy has already been set.");
                    return e ? (Array.isArray(e) ? (this.reconnectPolicy = new gn(e)) : (this.reconnectPolicy = e)) : (this.reconnectPolicy = new gn()), this;
                }
                withServerTimeout(e) {
                    return $t.isRequired(e, "milliseconds"), (this._serverTimeoutInMilliseconds = e), this;
                }
                withKeepAliveInterval(e) {
                    return $t.isRequired(e, "milliseconds"), (this._keepAliveIntervalInMilliseconds = e), this;
                }
                withStatefulReconnect(e) {
                    return void 0 === this.httpConnectionOptions && (this.httpConnectionOptions = {}), (this.httpConnectionOptions._useStatefulReconnect = !0), (this._statefulReconnectBufferSize = null == e ? void 0 : e.bufferSize), this;
                }
                build() {
                    const e = this.httpConnectionOptions || {};
                    if ((void 0 === e.logger && (e.logger = this.logger), !this.url)) throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
                    const t = new Dn(this.url, e);
                    return pn.create(t, this.logger || Ot.instance, this.protocol || new Mn(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
                }
            }
            var Ln;
            !(function (e) {
                (e[(e.Default = 0)] = "Default"), (e[(e.Server = 1)] = "Server"), (e[(e.WebAssembly = 2)] = "WebAssembly"), (e[(e.WebView = 3)] = "WebView");
            })(Ln || (Ln = {}));
            var Bn,
                On,
                Fn,
                $n = 4294967295;
            function Hn(e, t, n) {
                var o = Math.floor(n / 4294967296),
                    r = n;
                e.setUint32(t, o), e.setUint32(t + 4, r);
            }
            function Wn(e, t) {
                return 4294967296 * e.getInt32(t) + e.getUint32(t + 4);
            }
            var jn =
                ("undefined" == typeof process || "never" !== (null === (Bn = null === process || void 0 === process ? void 0 : process.env) || void 0 === Bn ? void 0 : Bn.TEXT_ENCODING)) &&
                "undefined" != typeof TextEncoder &&
                "undefined" != typeof TextDecoder;
            function zn(e) {
                for (var t = e.length, n = 0, o = 0; o < t; ) {
                    var r = e.charCodeAt(o++);
                    if (0 != (4294967168 & r))
                        if (0 == (4294965248 & r)) n += 2;
                        else {
                            if (r >= 55296 && r <= 56319 && o < t) {
                                var i = e.charCodeAt(o);
                                56320 == (64512 & i) && (++o, (r = ((1023 & r) << 10) + (1023 & i) + 65536));
                            }
                            n += 0 == (4294901760 & r) ? 3 : 4;
                        }
                    else n++;
                }
                return n;
            }
            var qn = jn ? new TextEncoder() : void 0,
                Jn = jn ? ("undefined" != typeof process && "force" !== (null === (On = null === process || void 0 === process ? void 0 : process.env) || void 0 === On ? void 0 : On.TEXT_ENCODING) ? 200 : 0) : $n,
                Kn = (null == qn ? void 0 : qn.encodeInto)
                    ? function (e, t, n) {
                          qn.encodeInto(e, t.subarray(n));
                      }
                    : function (e, t, n) {
                          t.set(qn.encode(e), n);
                      };
            function Vn(e, t, n) {
                for (var o = t, r = o + n, i = [], s = ""; o < r; ) {
                    var a = e[o++];
                    if (0 == (128 & a)) i.push(a);
                    else if (192 == (224 & a)) {
                        var c = 63 & e[o++];
                        i.push(((31 & a) << 6) | c);
                    } else if (224 == (240 & a)) {
                        c = 63 & e[o++];
                        var l = 63 & e[o++];
                        i.push(((31 & a) << 12) | (c << 6) | l);
                    } else if (240 == (248 & a)) {
                        var h = ((7 & a) << 18) | ((c = 63 & e[o++]) << 12) | ((l = 63 & e[o++]) << 6) | (63 & e[o++]);
                        h > 65535 && ((h -= 65536), i.push(((h >>> 10) & 1023) | 55296), (h = 56320 | (1023 & h))), i.push(h);
                    } else i.push(a);
                    i.length >= 4096 && ((s += String.fromCharCode.apply(String, i)), (i.length = 0));
                }
                return i.length > 0 && (s += String.fromCharCode.apply(String, i)), s;
            }
            var Xn,
                Gn = jn ? new TextDecoder() : null,
                Yn = jn ? ("undefined" != typeof process && "force" !== (null === (Fn = null === process || void 0 === process ? void 0 : process.env) || void 0 === Fn ? void 0 : Fn.TEXT_DECODER) ? 200 : 0) : $n,
                Qn = function (e, t) {
                    (this.type = e), (this.data = t);
                },
                Zn =
                    ((Xn = function (e, t) {
                        return (
                            (Xn =
                                Object.setPrototypeOf ||
                                ({ __proto__: [] } instanceof Array &&
                                    function (e, t) {
                                        e.__proto__ = t;
                                    }) ||
                                function (e, t) {
                                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                                }),
                            Xn(e, t)
                        );
                    }),
                    function (e, t) {
                        if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
                        function n() {
                            this.constructor = e;
                        }
                        Xn(e, t), (e.prototype = null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
                    }),
                eo = (function (e) {
                    function t(n) {
                        var o = e.call(this, n) || this,
                            r = Object.create(t.prototype);
                        return Object.setPrototypeOf(o, r), Object.defineProperty(o, "name", { configurable: !0, enumerable: !1, value: t.name }), o;
                    }
                    return Zn(t, e), t;
                })(Error),
                to = {
                    type: -1,
                    encode: function (e) {
                        var t, n, o, r;
                        return e instanceof Date
                            ? (function (e) {
                                  var t,
                                      n = e.sec,
                                      o = e.nsec;
                                  if (n >= 0 && o >= 0 && n <= 17179869183) {
                                      if (0 === o && n <= 4294967295) {
                                          var r = new Uint8Array(4);
                                          return (t = new DataView(r.buffer)).setUint32(0, n), r;
                                      }
                                      var i = n / 4294967296,
                                          s = 4294967295 & n;
                                      return (r = new Uint8Array(8)), (t = new DataView(r.buffer)).setUint32(0, (o << 2) | (3 & i)), t.setUint32(4, s), r;
                                  }
                                  return (r = new Uint8Array(12)), (t = new DataView(r.buffer)).setUint32(0, o), Hn(t, 4, n), r;
                              })(((o = 1e6 * ((t = e.getTime()) - 1e3 * (n = Math.floor(t / 1e3)))), { sec: n + (r = Math.floor(o / 1e9)), nsec: o - 1e9 * r }))
                            : null;
                    },
                    decode: function (e) {
                        var t = (function (e) {
                            var t = new DataView(e.buffer, e.byteOffset, e.byteLength);
                            switch (e.byteLength) {
                                case 4:
                                    return { sec: t.getUint32(0), nsec: 0 };
                                case 8:
                                    var n = t.getUint32(0);
                                    return { sec: 4294967296 * (3 & n) + t.getUint32(4), nsec: n >>> 2 };
                                case 12:
                                    return { sec: Wn(t, 4), nsec: t.getUint32(0) };
                                default:
                                    throw new eo("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(e.length));
                            }
                        })(e);
                        return new Date(1e3 * t.sec + t.nsec / 1e6);
                    },
                },
                no = (function () {
                    function e() {
                        (this.builtInEncoders = []), (this.builtInDecoders = []), (this.encoders = []), (this.decoders = []), this.register(to);
                    }
                    return (
                        (e.prototype.register = function (e) {
                            var t = e.type,
                                n = e.encode,
                                o = e.decode;
                            if (t >= 0) (this.encoders[t] = n), (this.decoders[t] = o);
                            else {
                                var r = 1 + t;
                                (this.builtInEncoders[r] = n), (this.builtInDecoders[r] = o);
                            }
                        }),
                        (e.prototype.tryToEncode = function (e, t) {
                            for (var n = 0; n < this.builtInEncoders.length; n++) if (null != (o = this.builtInEncoders[n]) && null != (r = o(e, t))) return new Qn(-1 - n, r);
                            for (n = 0; n < this.encoders.length; n++) {
                                var o, r;
                                if (null != (o = this.encoders[n]) && null != (r = o(e, t))) return new Qn(n, r);
                            }
                            return e instanceof Qn ? e : null;
                        }),
                        (e.prototype.decode = function (e, t, n) {
                            var o = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
                            return o ? o(e, t, n) : new Qn(t, e);
                        }),
                        (e.defaultCodec = new e()),
                        e
                    );
                })();
            function oo(e) {
                return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e instanceof ArrayBuffer ? new Uint8Array(e) : Uint8Array.from(e);
            }
            var ro = (function () {
                function e(e, t, n, o, r, i, s, a) {
                    void 0 === e && (e = no.defaultCodec),
                        void 0 === t && (t = void 0),
                        void 0 === n && (n = 100),
                        void 0 === o && (o = 2048),
                        void 0 === r && (r = !1),
                        void 0 === i && (i = !1),
                        void 0 === s && (s = !1),
                        void 0 === a && (a = !1),
                        (this.extensionCodec = e),
                        (this.context = t),
                        (this.maxDepth = n),
                        (this.initialBufferSize = o),
                        (this.sortKeys = r),
                        (this.forceFloat32 = i),
                        (this.ignoreUndefined = s),
                        (this.forceIntegerToFloat = a),
                        (this.pos = 0),
                        (this.view = new DataView(new ArrayBuffer(this.initialBufferSize))),
                        (this.bytes = new Uint8Array(this.view.buffer));
                }
                return (
                    (e.prototype.reinitializeState = function () {
                        this.pos = 0;
                    }),
                    (e.prototype.encodeSharedRef = function (e) {
                        return this.reinitializeState(), this.doEncode(e, 1), this.bytes.subarray(0, this.pos);
                    }),
                    (e.prototype.encode = function (e) {
                        return this.reinitializeState(), this.doEncode(e, 1), this.bytes.slice(0, this.pos);
                    }),
                    (e.prototype.doEncode = function (e, t) {
                        if (t > this.maxDepth) throw new Error("Too deep objects in depth ".concat(t));
                        null == e ? this.encodeNil() : "boolean" == typeof e ? this.encodeBoolean(e) : "number" == typeof e ? this.encodeNumber(e) : "string" == typeof e ? this.encodeString(e) : this.encodeObject(e, t);
                    }),
                    (e.prototype.ensureBufferSizeToWrite = function (e) {
                        var t = this.pos + e;
                        this.view.byteLength < t && this.resizeBuffer(2 * t);
                    }),
                    (e.prototype.resizeBuffer = function (e) {
                        var t = new ArrayBuffer(e),
                            n = new Uint8Array(t),
                            o = new DataView(t);
                        n.set(this.bytes), (this.view = o), (this.bytes = n);
                    }),
                    (e.prototype.encodeNil = function () {
                        this.writeU8(192);
                    }),
                    (e.prototype.encodeBoolean = function (e) {
                        !1 === e ? this.writeU8(194) : this.writeU8(195);
                    }),
                    (e.prototype.encodeNumber = function (e) {
                        Number.isSafeInteger(e) && !this.forceIntegerToFloat
                            ? e >= 0
                                ? e < 128
                                    ? this.writeU8(e)
                                    : e < 256
                                    ? (this.writeU8(204), this.writeU8(e))
                                    : e < 65536
                                    ? (this.writeU8(205), this.writeU16(e))
                                    : e < 4294967296
                                    ? (this.writeU8(206), this.writeU32(e))
                                    : (this.writeU8(207), this.writeU64(e))
                                : e >= -32
                                ? this.writeU8(224 | (e + 32))
                                : e >= -128
                                ? (this.writeU8(208), this.writeI8(e))
                                : e >= -32768
                                ? (this.writeU8(209), this.writeI16(e))
                                : e >= -2147483648
                                ? (this.writeU8(210), this.writeI32(e))
                                : (this.writeU8(211), this.writeI64(e))
                            : this.forceFloat32
                            ? (this.writeU8(202), this.writeF32(e))
                            : (this.writeU8(203), this.writeF64(e));
                    }),
                    (e.prototype.writeStringHeader = function (e) {
                        if (e < 32) this.writeU8(160 + e);
                        else if (e < 256) this.writeU8(217), this.writeU8(e);
                        else if (e < 65536) this.writeU8(218), this.writeU16(e);
                        else {
                            if (!(e < 4294967296)) throw new Error("Too long string: ".concat(e, " bytes in UTF-8"));
                            this.writeU8(219), this.writeU32(e);
                        }
                    }),
                    (e.prototype.encodeString = function (e) {
                        if (e.length > Jn) {
                            var t = zn(e);
                            this.ensureBufferSizeToWrite(5 + t), this.writeStringHeader(t), Kn(e, this.bytes, this.pos), (this.pos += t);
                        } else
                            (t = zn(e)),
                                this.ensureBufferSizeToWrite(5 + t),
                                this.writeStringHeader(t),
                                (function (e, t, n) {
                                    for (var o = e.length, r = n, i = 0; i < o; ) {
                                        var s = e.charCodeAt(i++);
                                        if (0 != (4294967168 & s)) {
                                            if (0 == (4294965248 & s)) t[r++] = ((s >> 6) & 31) | 192;
                                            else {
                                                if (s >= 55296 && s <= 56319 && i < o) {
                                                    var a = e.charCodeAt(i);
                                                    56320 == (64512 & a) && (++i, (s = ((1023 & s) << 10) + (1023 & a) + 65536));
                                                }
                                                0 == (4294901760 & s)
                                                    ? ((t[r++] = ((s >> 12) & 15) | 224), (t[r++] = ((s >> 6) & 63) | 128))
                                                    : ((t[r++] = ((s >> 18) & 7) | 240), (t[r++] = ((s >> 12) & 63) | 128), (t[r++] = ((s >> 6) & 63) | 128));
                                            }
                                            t[r++] = (63 & s) | 128;
                                        } else t[r++] = s;
                                    }
                                })(e, this.bytes, this.pos),
                                (this.pos += t);
                    }),
                    (e.prototype.encodeObject = function (e, t) {
                        var n = this.extensionCodec.tryToEncode(e, this.context);
                        if (null != n) this.encodeExtension(n);
                        else if (Array.isArray(e)) this.encodeArray(e, t);
                        else if (ArrayBuffer.isView(e)) this.encodeBinary(e);
                        else {
                            if ("object" != typeof e) throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(e)));
                            this.encodeMap(e, t);
                        }
                    }),
                    (e.prototype.encodeBinary = function (e) {
                        var t = e.byteLength;
                        if (t < 256) this.writeU8(196), this.writeU8(t);
                        else if (t < 65536) this.writeU8(197), this.writeU16(t);
                        else {
                            if (!(t < 4294967296)) throw new Error("Too large binary: ".concat(t));
                            this.writeU8(198), this.writeU32(t);
                        }
                        var n = oo(e);
                        this.writeU8a(n);
                    }),
                    (e.prototype.encodeArray = function (e, t) {
                        var n = e.length;
                        if (n < 16) this.writeU8(144 + n);
                        else if (n < 65536) this.writeU8(220), this.writeU16(n);
                        else {
                            if (!(n < 4294967296)) throw new Error("Too large array: ".concat(n));
                            this.writeU8(221), this.writeU32(n);
                        }
                        for (var o = 0, r = e; o < r.length; o++) {
                            var i = r[o];
                            this.doEncode(i, t + 1);
                        }
                    }),
                    (e.prototype.countWithoutUndefined = function (e, t) {
                        for (var n = 0, o = 0, r = t; o < r.length; o++) void 0 !== e[r[o]] && n++;
                        return n;
                    }),
                    (e.prototype.encodeMap = function (e, t) {
                        var n = Object.keys(e);
                        this.sortKeys && n.sort();
                        var o = this.ignoreUndefined ? this.countWithoutUndefined(e, n) : n.length;
                        if (o < 16) this.writeU8(128 + o);
                        else if (o < 65536) this.writeU8(222), this.writeU16(o);
                        else {
                            if (!(o < 4294967296)) throw new Error("Too large map object: ".concat(o));
                            this.writeU8(223), this.writeU32(o);
                        }
                        for (var r = 0, i = n; r < i.length; r++) {
                            var s = i[r],
                                a = e[s];
                            (this.ignoreUndefined && void 0 === a) || (this.encodeString(s), this.doEncode(a, t + 1));
                        }
                    }),
                    (e.prototype.encodeExtension = function (e) {
                        var t = e.data.length;
                        if (1 === t) this.writeU8(212);
                        else if (2 === t) this.writeU8(213);
                        else if (4 === t) this.writeU8(214);
                        else if (8 === t) this.writeU8(215);
                        else if (16 === t) this.writeU8(216);
                        else if (t < 256) this.writeU8(199), this.writeU8(t);
                        else if (t < 65536) this.writeU8(200), this.writeU16(t);
                        else {
                            if (!(t < 4294967296)) throw new Error("Too large extension object: ".concat(t));
                            this.writeU8(201), this.writeU32(t);
                        }
                        this.writeI8(e.type), this.writeU8a(e.data);
                    }),
                    (e.prototype.writeU8 = function (e) {
                        this.ensureBufferSizeToWrite(1), this.view.setUint8(this.pos, e), this.pos++;
                    }),
                    (e.prototype.writeU8a = function (e) {
                        var t = e.length;
                        this.ensureBufferSizeToWrite(t), this.bytes.set(e, this.pos), (this.pos += t);
                    }),
                    (e.prototype.writeI8 = function (e) {
                        this.ensureBufferSizeToWrite(1), this.view.setInt8(this.pos, e), this.pos++;
                    }),
                    (e.prototype.writeU16 = function (e) {
                        this.ensureBufferSizeToWrite(2), this.view.setUint16(this.pos, e), (this.pos += 2);
                    }),
                    (e.prototype.writeI16 = function (e) {
                        this.ensureBufferSizeToWrite(2), this.view.setInt16(this.pos, e), (this.pos += 2);
                    }),
                    (e.prototype.writeU32 = function (e) {
                        this.ensureBufferSizeToWrite(4), this.view.setUint32(this.pos, e), (this.pos += 4);
                    }),
                    (e.prototype.writeI32 = function (e) {
                        this.ensureBufferSizeToWrite(4), this.view.setInt32(this.pos, e), (this.pos += 4);
                    }),
                    (e.prototype.writeF32 = function (e) {
                        this.ensureBufferSizeToWrite(4), this.view.setFloat32(this.pos, e), (this.pos += 4);
                    }),
                    (e.prototype.writeF64 = function (e) {
                        this.ensureBufferSizeToWrite(8), this.view.setFloat64(this.pos, e), (this.pos += 8);
                    }),
                    (e.prototype.writeU64 = function (e) {
                        this.ensureBufferSizeToWrite(8),
                            (function (e, t, n) {
                                var o = n / 4294967296,
                                    r = n;
                                e.setUint32(t, o), e.setUint32(t + 4, r);
                            })(this.view, this.pos, e),
                            (this.pos += 8);
                    }),
                    (e.prototype.writeI64 = function (e) {
                        this.ensureBufferSizeToWrite(8), Hn(this.view, this.pos, e), (this.pos += 8);
                    }),
                    e
                );
            })();
            function io(e) {
                return "".concat(e < 0 ? "-" : "", "0x").concat(Math.abs(e).toString(16).padStart(2, "0"));
            }
            var so = (function () {
                    function e(e, t) {
                        void 0 === e && (e = 16), void 0 === t && (t = 16), (this.maxKeyLength = e), (this.maxLengthPerKey = t), (this.hit = 0), (this.miss = 0), (this.caches = []);
                        for (var n = 0; n < this.maxKeyLength; n++) this.caches.push([]);
                    }
                    return (
                        (e.prototype.canBeCached = function (e) {
                            return e > 0 && e <= this.maxKeyLength;
                        }),
                        (e.prototype.find = function (e, t, n) {
                            e: for (var o = 0, r = this.caches[n - 1]; o < r.length; o++) {
                                for (var i = r[o], s = i.bytes, a = 0; a < n; a++) if (s[a] !== e[t + a]) continue e;
                                return i.str;
                            }
                            return null;
                        }),
                        (e.prototype.store = function (e, t) {
                            var n = this.caches[e.length - 1],
                                o = { bytes: e, str: t };
                            n.length >= this.maxLengthPerKey ? (n[(Math.random() * n.length) | 0] = o) : n.push(o);
                        }),
                        (e.prototype.decode = function (e, t, n) {
                            var o = this.find(e, t, n);
                            if (null != o) return this.hit++, o;
                            this.miss++;
                            var r = Vn(e, t, n),
                                i = Uint8Array.prototype.slice.call(e, t, t + n);
                            return this.store(i, r), r;
                        }),
                        e
                    );
                })(),
                ao = function (e, t) {
                    var n,
                        o,
                        r,
                        i,
                        s = {
                            label: 0,
                            sent: function () {
                                if (1 & r[0]) throw r[1];
                                return r[1];
                            },
                            trys: [],
                            ops: [],
                        };
                    return (
                        (i = { next: a(0), throw: a(1), return: a(2) }),
                        "function" == typeof Symbol &&
                            (i[Symbol.iterator] = function () {
                                return this;
                            }),
                        i
                    );
                    function a(i) {
                        return function (a) {
                            return (function (i) {
                                if (n) throw new TypeError("Generator is already executing.");
                                for (; s; )
                                    try {
                                        if (((n = 1), o && (r = 2 & i[0] ? o.return : i[0] ? o.throw || ((r = o.return) && r.call(o), 0) : o.next) && !(r = r.call(o, i[1])).done)) return r;
                                        switch (((o = 0), r && (i = [2 & i[0], r.value]), i[0])) {
                                            case 0:
                                            case 1:
                                                r = i;
                                                break;
                                            case 4:
                                                return s.label++, { value: i[1], done: !1 };
                                            case 5:
                                                s.label++, (o = i[1]), (i = [0]);
                                                continue;
                                            case 7:
                                                (i = s.ops.pop()), s.trys.pop();
                                                continue;
                                            default:
                                                if (!((r = (r = s.trys).length > 0 && r[r.length - 1]) || (6 !== i[0] && 2 !== i[0]))) {
                                                    s = 0;
                                                    continue;
                                                }
                                                if (3 === i[0] && (!r || (i[1] > r[0] && i[1] < r[3]))) {
                                                    s.label = i[1];
                                                    break;
                                                }
                                                if (6 === i[0] && s.label < r[1]) {
                                                    (s.label = r[1]), (r = i);
                                                    break;
                                                }
                                                if (r && s.label < r[2]) {
                                                    (s.label = r[2]), s.ops.push(i);
                                                    break;
                                                }
                                                r[2] && s.ops.pop(), s.trys.pop();
                                                continue;
                                        }
                                        i = t.call(e, s);
                                    } catch (e) {
                                        (i = [6, e]), (o = 0);
                                    } finally {
                                        n = r = 0;
                                    }
                                if (5 & i[0]) throw i[1];
                                return { value: i[0] ? i[1] : void 0, done: !0 };
                            })([i, a]);
                        };
                    }
                },
                co = function (e) {
                    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                    var t,
                        n = e[Symbol.asyncIterator];
                    return n
                        ? n.call(e)
                        : ((e = "function" == typeof __values ? __values(e) : e[Symbol.iterator]()),
                          (t = {}),
                          o("next"),
                          o("throw"),
                          o("return"),
                          (t[Symbol.asyncIterator] = function () {
                              return this;
                          }),
                          t);
                    function o(n) {
                        t[n] =
                            e[n] &&
                            function (t) {
                                return new Promise(function (o, r) {
                                    !(function (e, t, n, o) {
                                        Promise.resolve(o).then(function (t) {
                                            e({ value: t, done: n });
                                        }, t);
                                    })(o, r, (t = e[n](t)).done, t.value);
                                });
                            };
                    }
                },
                lo = function (e) {
                    return this instanceof lo ? ((this.v = e), this) : new lo(e);
                },
                ho = new DataView(new ArrayBuffer(0)),
                uo = new Uint8Array(ho.buffer),
                po = (function () {
                    try {
                        ho.getInt8(0);
                    } catch (e) {
                        return e.constructor;
                    }
                    throw new Error("never reached");
                })(),
                fo = new po("Insufficient data"),
                go = new so(),
                mo = (function () {
                    function e(e, t, n, o, r, i, s, a) {
                        void 0 === e && (e = no.defaultCodec),
                            void 0 === t && (t = void 0),
                            void 0 === n && (n = $n),
                            void 0 === o && (o = $n),
                            void 0 === r && (r = $n),
                            void 0 === i && (i = $n),
                            void 0 === s && (s = $n),
                            void 0 === a && (a = go),
                            (this.extensionCodec = e),
                            (this.context = t),
                            (this.maxStrLength = n),
                            (this.maxBinLength = o),
                            (this.maxArrayLength = r),
                            (this.maxMapLength = i),
                            (this.maxExtLength = s),
                            (this.keyDecoder = a),
                            (this.totalPos = 0),
                            (this.pos = 0),
                            (this.view = ho),
                            (this.bytes = uo),
                            (this.headByte = -1),
                            (this.stack = []);
                    }
                    return (
                        (e.prototype.reinitializeState = function () {
                            (this.totalPos = 0), (this.headByte = -1), (this.stack.length = 0);
                        }),
                        (e.prototype.setBuffer = function (e) {
                            (this.bytes = oo(e)),
                                (this.view = (function (e) {
                                    if (e instanceof ArrayBuffer) return new DataView(e);
                                    var t = oo(e);
                                    return new DataView(t.buffer, t.byteOffset, t.byteLength);
                                })(this.bytes)),
                                (this.pos = 0);
                        }),
                        (e.prototype.appendBuffer = function (e) {
                            if (-1 !== this.headByte || this.hasRemaining(1)) {
                                var t = this.bytes.subarray(this.pos),
                                    n = oo(e),
                                    o = new Uint8Array(t.length + n.length);
                                o.set(t), o.set(n, t.length), this.setBuffer(o);
                            } else this.setBuffer(e);
                        }),
                        (e.prototype.hasRemaining = function (e) {
                            return this.view.byteLength - this.pos >= e;
                        }),
                        (e.prototype.createExtraByteError = function (e) {
                            var t = this.view,
                                n = this.pos;
                            return new RangeError(
                                "Extra "
                                    .concat(t.byteLength - n, " of ")
                                    .concat(t.byteLength, " byte(s) found at buffer[")
                                    .concat(e, "]")
                            );
                        }),
                        (e.prototype.decode = function (e) {
                            this.reinitializeState(), this.setBuffer(e);
                            var t = this.doDecodeSync();
                            if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
                            return t;
                        }),
                        (e.prototype.decodeMulti = function (e) {
                            return ao(this, function (t) {
                                switch (t.label) {
                                    case 0:
                                        this.reinitializeState(), this.setBuffer(e), (t.label = 1);
                                    case 1:
                                        return this.hasRemaining(1) ? [4, this.doDecodeSync()] : [3, 3];
                                    case 2:
                                        return t.sent(), [3, 1];
                                    case 3:
                                        return [2];
                                }
                            });
                        }),
                        (e.prototype.decodeAsync = function (e) {
                            var t, n, o, r, i, s, a;
                            return (
                                (i = this),
                                void 0,
                                (a = function () {
                                    var i, s, a, c, l, h, d, u;
                                    return ao(this, function (p) {
                                        switch (p.label) {
                                            case 0:
                                                (i = !1), (p.label = 1);
                                            case 1:
                                                p.trys.push([1, 6, 7, 12]), (t = co(e)), (p.label = 2);
                                            case 2:
                                                return [4, t.next()];
                                            case 3:
                                                if ((n = p.sent()).done) return [3, 5];
                                                if (((a = n.value), i)) throw this.createExtraByteError(this.totalPos);
                                                this.appendBuffer(a);
                                                try {
                                                    (s = this.doDecodeSync()), (i = !0);
                                                } catch (e) {
                                                    if (!(e instanceof po)) throw e;
                                                }
                                                (this.totalPos += this.pos), (p.label = 4);
                                            case 4:
                                                return [3, 2];
                                            case 5:
                                                return [3, 12];
                                            case 6:
                                                return (c = p.sent()), (o = { error: c }), [3, 12];
                                            case 7:
                                                return p.trys.push([7, , 10, 11]), n && !n.done && (r = t.return) ? [4, r.call(t)] : [3, 9];
                                            case 8:
                                                p.sent(), (p.label = 9);
                                            case 9:
                                                return [3, 11];
                                            case 10:
                                                if (o) throw o.error;
                                                return [7];
                                            case 11:
                                                return [7];
                                            case 12:
                                                if (i) {
                                                    if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
                                                    return [2, s];
                                                }
                                                throw ((h = (l = this).headByte), (d = l.pos), (u = l.totalPos), new RangeError("Insufficient data in parsing ".concat(io(h), " at ").concat(u, " (").concat(d, " in the current buffer)")));
                                        }
                                    });
                                }),
                                new ((s = void 0) || (s = Promise))(function (e, t) {
                                    function n(e) {
                                        try {
                                            r(a.next(e));
                                        } catch (e) {
                                            t(e);
                                        }
                                    }
                                    function o(e) {
                                        try {
                                            r(a.throw(e));
                                        } catch (e) {
                                            t(e);
                                        }
                                    }
                                    function r(t) {
                                        var r;
                                        t.done
                                            ? e(t.value)
                                            : ((r = t.value),
                                              r instanceof s
                                                  ? r
                                                  : new s(function (e) {
                                                        e(r);
                                                    })).then(n, o);
                                    }
                                    r((a = a.apply(i, [])).next());
                                })
                            );
                        }),
                        (e.prototype.decodeArrayStream = function (e) {
                            return this.decodeMultiAsync(e, !0);
                        }),
                        (e.prototype.decodeStream = function (e) {
                            return this.decodeMultiAsync(e, !1);
                        }),
                        (e.prototype.decodeMultiAsync = function (e, t) {
                            return (function (n, o, r) {
                                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                                var i,
                                    s = function () {
                                        var n, o, r, i, s, a, c, l, h;
                                        return ao(this, function (d) {
                                            switch (d.label) {
                                                case 0:
                                                    (n = t), (o = -1), (d.label = 1);
                                                case 1:
                                                    d.trys.push([1, 13, 14, 19]), (r = co(e)), (d.label = 2);
                                                case 2:
                                                    return [4, lo(r.next())];
                                                case 3:
                                                    if ((i = d.sent()).done) return [3, 12];
                                                    if (((s = i.value), t && 0 === o)) throw this.createExtraByteError(this.totalPos);
                                                    this.appendBuffer(s), n && ((o = this.readArraySize()), (n = !1), this.complete()), (d.label = 4);
                                                case 4:
                                                    d.trys.push([4, 9, , 10]), (d.label = 5);
                                                case 5:
                                                    return [4, lo(this.doDecodeSync())];
                                                case 6:
                                                    return [4, d.sent()];
                                                case 7:
                                                    return d.sent(), 0 == --o ? [3, 8] : [3, 5];
                                                case 8:
                                                    return [3, 10];
                                                case 9:
                                                    if (!((a = d.sent()) instanceof po)) throw a;
                                                    return [3, 10];
                                                case 10:
                                                    (this.totalPos += this.pos), (d.label = 11);
                                                case 11:
                                                    return [3, 2];
                                                case 12:
                                                    return [3, 19];
                                                case 13:
                                                    return (c = d.sent()), (l = { error: c }), [3, 19];
                                                case 14:
                                                    return d.trys.push([14, , 17, 18]), i && !i.done && (h = r.return) ? [4, lo(h.call(r))] : [3, 16];
                                                case 15:
                                                    d.sent(), (d.label = 16);
                                                case 16:
                                                    return [3, 18];
                                                case 17:
                                                    if (l) throw l.error;
                                                    return [7];
                                                case 18:
                                                    return [7];
                                                case 19:
                                                    return [2];
                                            }
                                        });
                                    }.apply(n, o || []),
                                    a = [];
                                return (
                                    (i = {}),
                                    c("next"),
                                    c("throw"),
                                    c("return"),
                                    (i[Symbol.asyncIterator] = function () {
                                        return this;
                                    }),
                                    i
                                );
                                function c(e) {
                                    s[e] &&
                                        (i[e] = function (t) {
                                            return new Promise(function (n, o) {
                                                a.push([e, t, n, o]) > 1 || l(e, t);
                                            });
                                        });
                                }
                                function l(e, t) {
                                    try {
                                        (n = s[e](t)).value instanceof lo ? Promise.resolve(n.value.v).then(h, d) : u(a[0][2], n);
                                    } catch (e) {
                                        u(a[0][3], e);
                                    }
                                    var n;
                                }
                                function h(e) {
                                    l("next", e);
                                }
                                function d(e) {
                                    l("throw", e);
                                }
                                function u(e, t) {
                                    e(t), a.shift(), a.length && l(a[0][0], a[0][1]);
                                }
                            })(this, arguments);
                        }),
                        (e.prototype.doDecodeSync = function () {
                            e: for (;;) {
                                var e = this.readHeadByte(),
                                    t = void 0;
                                if (e >= 224) t = e - 256;
                                else if (e < 192)
                                    if (e < 128) t = e;
                                    else if (e < 144) {
                                        if (0 != (o = e - 128)) {
                                            this.pushMapState(o), this.complete();
                                            continue e;
                                        }
                                        t = {};
                                    } else if (e < 160) {
                                        if (0 != (o = e - 144)) {
                                            this.pushArrayState(o), this.complete();
                                            continue e;
                                        }
                                        t = [];
                                    } else {
                                        var n = e - 160;
                                        t = this.decodeUtf8String(n, 0);
                                    }
                                else if (192 === e) t = null;
                                else if (194 === e) t = !1;
                                else if (195 === e) t = !0;
                                else if (202 === e) t = this.readF32();
                                else if (203 === e) t = this.readF64();
                                else if (204 === e) t = this.readU8();
                                else if (205 === e) t = this.readU16();
                                else if (206 === e) t = this.readU32();
                                else if (207 === e) t = this.readU64();
                                else if (208 === e) t = this.readI8();
                                else if (209 === e) t = this.readI16();
                                else if (210 === e) t = this.readI32();
                                else if (211 === e) t = this.readI64();
                                else if (217 === e) (n = this.lookU8()), (t = this.decodeUtf8String(n, 1));
                                else if (218 === e) (n = this.lookU16()), (t = this.decodeUtf8String(n, 2));
                                else if (219 === e) (n = this.lookU32()), (t = this.decodeUtf8String(n, 4));
                                else if (220 === e) {
                                    if (0 !== (o = this.readU16())) {
                                        this.pushArrayState(o), this.complete();
                                        continue e;
                                    }
                                    t = [];
                                } else if (221 === e) {
                                    if (0 !== (o = this.readU32())) {
                                        this.pushArrayState(o), this.complete();
                                        continue e;
                                    }
                                    t = [];
                                } else if (222 === e) {
                                    if (0 !== (o = this.readU16())) {
                                        this.pushMapState(o), this.complete();
                                        continue e;
                                    }
                                    t = {};
                                } else if (223 === e) {
                                    if (0 !== (o = this.readU32())) {
                                        this.pushMapState(o), this.complete();
                                        continue e;
                                    }
                                    t = {};
                                } else if (196 === e) {
                                    var o = this.lookU8();
                                    t = this.decodeBinary(o, 1);
                                } else if (197 === e) (o = this.lookU16()), (t = this.decodeBinary(o, 2));
                                else if (198 === e) (o = this.lookU32()), (t = this.decodeBinary(o, 4));
                                else if (212 === e) t = this.decodeExtension(1, 0);
                                else if (213 === e) t = this.decodeExtension(2, 0);
                                else if (214 === e) t = this.decodeExtension(4, 0);
                                else if (215 === e) t = this.decodeExtension(8, 0);
                                else if (216 === e) t = this.decodeExtension(16, 0);
                                else if (199 === e) (o = this.lookU8()), (t = this.decodeExtension(o, 1));
                                else if (200 === e) (o = this.lookU16()), (t = this.decodeExtension(o, 2));
                                else {
                                    if (201 !== e) throw new eo("Unrecognized type byte: ".concat(io(e)));
                                    (o = this.lookU32()), (t = this.decodeExtension(o, 4));
                                }
                                this.complete();
                                for (var r = this.stack; r.length > 0; ) {
                                    var i = r[r.length - 1];
                                    if (0 === i.type) {
                                        if (((i.array[i.position] = t), i.position++, i.position !== i.size)) continue e;
                                        r.pop(), (t = i.array);
                                    } else {
                                        if (1 === i.type) {
                                            if ("string" != (s = typeof t) && "number" !== s) throw new eo("The type of key must be string or number but " + typeof t);
                                            if ("__proto__" === t) throw new eo("The key __proto__ is not allowed");
                                            (i.key = t), (i.type = 2);
                                            continue e;
                                        }
                                        if (((i.map[i.key] = t), i.readCount++, i.readCount !== i.size)) {
                                            (i.key = null), (i.type = 1);
                                            continue e;
                                        }
                                        r.pop(), (t = i.map);
                                    }
                                }
                                return t;
                            }
                            var s;
                        }),
                        (e.prototype.readHeadByte = function () {
                            return -1 === this.headByte && (this.headByte = this.readU8()), this.headByte;
                        }),
                        (e.prototype.complete = function () {
                            this.headByte = -1;
                        }),
                        (e.prototype.readArraySize = function () {
                            var e = this.readHeadByte();
                            switch (e) {
                                case 220:
                                    return this.readU16();
                                case 221:
                                    return this.readU32();
                                default:
                                    if (e < 160) return e - 144;
                                    throw new eo("Unrecognized array type byte: ".concat(io(e)));
                            }
                        }),
                        (e.prototype.pushMapState = function (e) {
                            if (e > this.maxMapLength) throw new eo("Max length exceeded: map length (".concat(e, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
                            this.stack.push({ type: 1, size: e, key: null, readCount: 0, map: {} });
                        }),
                        (e.prototype.pushArrayState = function (e) {
                            if (e > this.maxArrayLength) throw new eo("Max length exceeded: array length (".concat(e, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
                            this.stack.push({ type: 0, size: e, array: new Array(e), position: 0 });
                        }),
                        (e.prototype.decodeUtf8String = function (e, t) {
                            var n;
                            if (e > this.maxStrLength) throw new eo("Max length exceeded: UTF-8 byte length (".concat(e, ") > maxStrLength (").concat(this.maxStrLength, ")"));
                            if (this.bytes.byteLength < this.pos + t + e) throw fo;
                            var o,
                                r = this.pos + t;
                            return (
                                (o =
                                    this.stateIsMapKey() && (null === (n = this.keyDecoder) || void 0 === n ? void 0 : n.canBeCached(e))
                                        ? this.keyDecoder.decode(this.bytes, r, e)
                                        : e > Yn
                                        ? (function (e, t, n) {
                                              var o = e.subarray(t, t + n);
                                              return Gn.decode(o);
                                          })(this.bytes, r, e)
                                        : Vn(this.bytes, r, e)),
                                (this.pos += t + e),
                                o
                            );
                        }),
                        (e.prototype.stateIsMapKey = function () {
                            return this.stack.length > 0 && 1 === this.stack[this.stack.length - 1].type;
                        }),
                        (e.prototype.decodeBinary = function (e, t) {
                            if (e > this.maxBinLength) throw new eo("Max length exceeded: bin length (".concat(e, ") > maxBinLength (").concat(this.maxBinLength, ")"));
                            if (!this.hasRemaining(e + t)) throw fo;
                            var n = this.pos + t,
                                o = this.bytes.subarray(n, n + e);
                            return (this.pos += t + e), o;
                        }),
                        (e.prototype.decodeExtension = function (e, t) {
                            if (e > this.maxExtLength) throw new eo("Max length exceeded: ext length (".concat(e, ") > maxExtLength (").concat(this.maxExtLength, ")"));
                            var n = this.view.getInt8(this.pos + t),
                                o = this.decodeBinary(e, t + 1);
                            return this.extensionCodec.decode(o, n, this.context);
                        }),
                        (e.prototype.lookU8 = function () {
                            return this.view.getUint8(this.pos);
                        }),
                        (e.prototype.lookU16 = function () {
                            return this.view.getUint16(this.pos);
                        }),
                        (e.prototype.lookU32 = function () {
                            return this.view.getUint32(this.pos);
                        }),
                        (e.prototype.readU8 = function () {
                            var e = this.view.getUint8(this.pos);
                            return this.pos++, e;
                        }),
                        (e.prototype.readI8 = function () {
                            var e = this.view.getInt8(this.pos);
                            return this.pos++, e;
                        }),
                        (e.prototype.readU16 = function () {
                            var e = this.view.getUint16(this.pos);
                            return (this.pos += 2), e;
                        }),
                        (e.prototype.readI16 = function () {
                            var e = this.view.getInt16(this.pos);
                            return (this.pos += 2), e;
                        }),
                        (e.prototype.readU32 = function () {
                            var e = this.view.getUint32(this.pos);
                            return (this.pos += 4), e;
                        }),
                        (e.prototype.readI32 = function () {
                            var e = this.view.getInt32(this.pos);
                            return (this.pos += 4), e;
                        }),
                        (e.prototype.readU64 = function () {
                            var e,
                                t,
                                n = ((e = this.view), (t = this.pos), 4294967296 * e.getUint32(t) + e.getUint32(t + 4));
                            return (this.pos += 8), n;
                        }),
                        (e.prototype.readI64 = function () {
                            var e = Wn(this.view, this.pos);
                            return (this.pos += 8), e;
                        }),
                        (e.prototype.readF32 = function () {
                            var e = this.view.getFloat32(this.pos);
                            return (this.pos += 4), e;
                        }),
                        (e.prototype.readF64 = function () {
                            var e = this.view.getFloat64(this.pos);
                            return (this.pos += 8), e;
                        }),
                        e
                    );
                })();
            class vo {
                static write(e) {
                    let t = e.byteLength || e.length;
                    const n = [];
                    do {
                        let e = 127 & t;
                        (t >>= 7), t > 0 && (e |= 128), n.push(e);
                    } while (t > 0);
                    t = e.byteLength || e.length;
                    const o = new Uint8Array(n.length + t);
                    return o.set(n, 0), o.set(e, n.length), o.buffer;
                }
                static parse(e) {
                    const t = [],
                        n = new Uint8Array(e),
                        o = [0, 7, 14, 21, 28];
                    for (let r = 0; r < e.byteLength; ) {
                        let i,
                            s = 0,
                            a = 0;
                        do {
                            (i = n[r + s]), (a |= (127 & i) << o[s]), s++;
                        } while (s < Math.min(5, e.byteLength - r) && 0 != (128 & i));
                        if (0 != (128 & i) && s < 5) throw new Error("Cannot read message size.");
                        if (5 === s && i > 7) throw new Error("Messages bigger than 2GB are not supported.");
                        if (!(n.byteLength >= r + s + a)) throw new Error("Incomplete message.");
                        t.push(n.slice ? n.slice(r + s, r + s + a) : n.subarray(r + s, r + s + a)), (r = r + s + a);
                    }
                    return t;
                }
            }
            const yo = new Uint8Array([145, cn.Ping]);
            class wo {
                constructor(e) {
                    (this.name = "messagepack"),
                        (this.version = 2),
                        (this.transferFormat = In.Binary),
                        (this._errorResult = 1),
                        (this._voidResult = 2),
                        (this._nonVoidResult = 3),
                        (e = e || {}),
                        (this._encoder = new ro(e.extensionCodec, e.context, e.maxDepth, e.initialBufferSize, e.sortKeys, e.forceFloat32, e.ignoreUndefined, e.forceIntegerToFloat)),
                        (this._decoder = new mo(e.extensionCodec, e.context, e.maxStrLength, e.maxBinLength, e.maxArrayLength, e.maxMapLength, e.maxExtLength));
                }
                parseMessages(e, t) {
                    if (!(n = e) || "undefined" == typeof ArrayBuffer || !(n instanceof ArrayBuffer || (n.constructor && "ArrayBuffer" === n.constructor.name)))
                        throw new Error("Invalid input for MessagePack hub protocol. Expected an ArrayBuffer.");
                    var n;
                    null === t && (t = Ot.instance);
                    const o = vo.parse(e),
                        r = [];
                    for (const e of o) {
                        const n = this._parseMessage(e, t);
                        n && r.push(n);
                    }
                    return r;
                }
                writeMessage(e) {
                    switch (e.type) {
                        case cn.Invocation:
                            return this._writeInvocation(e);
                        case cn.StreamInvocation:
                            return this._writeStreamInvocation(e);
                        case cn.StreamItem:
                            return this._writeStreamItem(e);
                        case cn.Completion:
                            return this._writeCompletion(e);
                        case cn.Ping:
                            return vo.write(yo);
                        case cn.CancelInvocation:
                            return this._writeCancelInvocation(e);
                        case cn.Close:
                            return this._writeClose();
                        case cn.Ack:
                            return this._writeAck(e);
                        case cn.Sequence:
                            return this._writeSequence(e);
                        default:
                            throw new Error("Invalid message type.");
                    }
                }
                _parseMessage(e, t) {
                    if (0 === e.length) throw new Error("Invalid payload.");
                    const n = this._decoder.decode(e);
                    if (0 === n.length || !(n instanceof Array)) throw new Error("Invalid payload.");
                    const o = n[0];
                    switch (o) {
                        case cn.Invocation:
                            return this._createInvocationMessage(this._readHeaders(n), n);
                        case cn.StreamItem:
                            return this._createStreamItemMessage(this._readHeaders(n), n);
                        case cn.Completion:
                            return this._createCompletionMessage(this._readHeaders(n), n);
                        case cn.Ping:
                            return this._createPingMessage(n);
                        case cn.Close:
                            return this._createCloseMessage(n);
                        case cn.Ack:
                            return this._createAckMessage(n);
                        case cn.Sequence:
                            return this._createSequenceMessage(n);
                        default:
                            return t.log(Bt.Information, "Unknown message type '" + o + "' ignored."), null;
                    }
                }
                _createCloseMessage(e) {
                    if (e.length < 2) throw new Error("Invalid payload for Close message.");
                    return { allowReconnect: e.length >= 3 ? e[2] : void 0, error: e[1], type: cn.Close };
                }
                _createPingMessage(e) {
                    if (e.length < 1) throw new Error("Invalid payload for Ping message.");
                    return { type: cn.Ping };
                }
                _createInvocationMessage(e, t) {
                    if (t.length < 5) throw new Error("Invalid payload for Invocation message.");
                    const n = t[2];
                    return n ? { arguments: t[4], headers: e, invocationId: n, streamIds: [], target: t[3], type: cn.Invocation } : { arguments: t[4], headers: e, streamIds: [], target: t[3], type: cn.Invocation };
                }
                _createStreamItemMessage(e, t) {
                    if (t.length < 4) throw new Error("Invalid payload for StreamItem message.");
                    return { headers: e, invocationId: t[2], item: t[3], type: cn.StreamItem };
                }
                _createCompletionMessage(e, t) {
                    if (t.length < 4) throw new Error("Invalid payload for Completion message.");
                    const n = t[3];
                    if (n !== this._voidResult && t.length < 5) throw new Error("Invalid payload for Completion message.");
                    let o, r;
                    switch (n) {
                        case this._errorResult:
                            o = t[4];
                            break;
                        case this._nonVoidResult:
                            r = t[4];
                    }
                    return { error: o, headers: e, invocationId: t[2], result: r, type: cn.Completion };
                }
                _createAckMessage(e) {
                    if (e.length < 1) throw new Error("Invalid payload for Ack message.");
                    return { sequenceId: e[1], type: cn.Ack };
                }
                _createSequenceMessage(e) {
                    if (e.length < 1) throw new Error("Invalid payload for Sequence message.");
                    return { sequenceId: e[1], type: cn.Sequence };
                }
                _writeInvocation(e) {
                    let t;
                    return (
                        (t = e.streamIds
                            ? this._encoder.encode([cn.Invocation, e.headers || {}, e.invocationId || null, e.target, e.arguments, e.streamIds])
                            : this._encoder.encode([cn.Invocation, e.headers || {}, e.invocationId || null, e.target, e.arguments])),
                        vo.write(t.slice())
                    );
                }
                _writeStreamInvocation(e) {
                    let t;
                    return (
                        (t = e.streamIds
                            ? this._encoder.encode([cn.StreamInvocation, e.headers || {}, e.invocationId, e.target, e.arguments, e.streamIds])
                            : this._encoder.encode([cn.StreamInvocation, e.headers || {}, e.invocationId, e.target, e.arguments])),
                        vo.write(t.slice())
                    );
                }
                _writeStreamItem(e) {
                    const t = this._encoder.encode([cn.StreamItem, e.headers || {}, e.invocationId, e.item]);
                    return vo.write(t.slice());
                }
                _writeCompletion(e) {
                    const t = e.error ? this._errorResult : void 0 !== e.result ? this._nonVoidResult : this._voidResult;
                    let n;
                    switch (t) {
                        case this._errorResult:
                            n = this._encoder.encode([cn.Completion, e.headers || {}, e.invocationId, t, e.error]);
                            break;
                        case this._voidResult:
                            n = this._encoder.encode([cn.Completion, e.headers || {}, e.invocationId, t]);
                            break;
                        case this._nonVoidResult:
                            n = this._encoder.encode([cn.Completion, e.headers || {}, e.invocationId, t, e.result]);
                    }
                    return vo.write(n.slice());
                }
                _writeCancelInvocation(e) {
                    const t = this._encoder.encode([cn.CancelInvocation, e.headers || {}, e.invocationId]);
                    return vo.write(t.slice());
                }
                _writeClose() {
                    const e = this._encoder.encode([cn.Close, null]);
                    return vo.write(e.slice());
                }
                _writeAck(e) {
                    const t = this._encoder.encode([cn.Ack, e.sequenceId]);
                    return vo.write(t.slice());
                }
                _writeSequence(e) {
                    const t = this._encoder.encode([cn.Sequence, e.sequenceId]);
                    return vo.write(t.slice());
                }
                _readHeaders(e) {
                    const t = e[1];
                    if ("object" != typeof t) throw new Error("Invalid headers.");
                    return t;
                }
            }
            const bo = "function" == typeof TextDecoder ? new TextDecoder("utf-8") : null,
                _o = bo
                    ? bo.decode.bind(bo)
                    : function (e) {
                          let t = 0;
                          const n = e.length,
                              o = [],
                              r = [];
                          for (; t < n; ) {
                              const n = e[t++];
                              if (0 === n) break;
                              if (0 == (128 & n)) o.push(n);
                              else if (192 == (224 & n)) {
                                  const r = 63 & e[t++];
                                  o.push(((31 & n) << 6) | r);
                              } else if (224 == (240 & n)) {
                                  const r = 63 & e[t++],
                                      i = 63 & e[t++];
                                  o.push(((31 & n) << 12) | (r << 6) | i);
                              } else if (240 == (248 & n)) {
                                  let r = ((7 & n) << 18) | ((63 & e[t++]) << 12) | ((63 & e[t++]) << 6) | (63 & e[t++]);
                                  r > 65535 && ((r -= 65536), o.push(((r >>> 10) & 1023) | 55296), (r = 56320 | (1023 & r))), o.push(r);
                              }
                              o.length > 1024 && (r.push(String.fromCharCode.apply(null, o)), (o.length = 0));
                          }
                          return r.push(String.fromCharCode.apply(null, o)), r.join("");
                      },
                So = Math.pow(2, 32),
                Co = Math.pow(2, 21) - 1;
            function Eo(e, t) {
                return e[t] | (e[t + 1] << 8) | (e[t + 2] << 16) | (e[t + 3] << 24);
            }
            function Io(e, t) {
                return e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + ((e[t + 3] << 24) >>> 0);
            }
            function ko(e, t) {
                const n = Io(e, t + 4);
                if (n > Co) throw new Error(`Cannot read uint64 with high order part ${n}, because the result would exceed Number.MAX_SAFE_INTEGER.`);
                return n * So + Io(e, t);
            }
            class To {
                constructor(e) {
                    this.batchData = e;
                    const t = new xo(e);
                    (this.arrayRangeReader = new No(e)), (this.arrayBuilderSegmentReader = new Mo(e)), (this.diffReader = new Ro(e)), (this.editReader = new Ao(e, t)), (this.frameReader = new Do(e, t));
                }
                updatedComponents() {
                    return Eo(this.batchData, this.batchData.length - 20);
                }
                referenceFrames() {
                    return Eo(this.batchData, this.batchData.length - 16);
                }
                disposedComponentIds() {
                    return Eo(this.batchData, this.batchData.length - 12);
                }
                disposedEventHandlerIds() {
                    return Eo(this.batchData, this.batchData.length - 8);
                }
                updatedComponentsEntry(e, t) {
                    const n = e + 4 * t;
                    return Eo(this.batchData, n);
                }
                referenceFramesEntry(e, t) {
                    return e + 20 * t;
                }
                disposedComponentIdsEntry(e, t) {
                    const n = e + 4 * t;
                    return Eo(this.batchData, n);
                }
                disposedEventHandlerIdsEntry(e, t) {
                    const n = e + 8 * t;
                    return ko(this.batchData, n);
                }
            }
            class Ro {
                constructor(e) {
                    this.batchDataUint8 = e;
                }
                componentId(e) {
                    return Eo(this.batchDataUint8, e);
                }
                edits(e) {
                    return e + 4;
                }
                editsEntry(e, t) {
                    return e + 16 * t;
                }
            }
            class Ao {
                constructor(e, t) {
                    (this.batchDataUint8 = e), (this.stringReader = t);
                }
                editType(e) {
                    return Eo(this.batchDataUint8, e);
                }
                siblingIndex(e) {
                    return Eo(this.batchDataUint8, e + 4);
                }
                newTreeIndex(e) {
                    return Eo(this.batchDataUint8, e + 8);
                }
                moveToSiblingIndex(e) {
                    return Eo(this.batchDataUint8, e + 8);
                }
                removedAttributeName(e) {
                    const t = Eo(this.batchDataUint8, e + 12);
                    return this.stringReader.readString(t);
                }
            }
            class Do {
                constructor(e, t) {
                    (this.batchDataUint8 = e), (this.stringReader = t);
                }
                frameType(e) {
                    return Eo(this.batchDataUint8, e);
                }
                subtreeLength(e) {
                    return Eo(this.batchDataUint8, e + 4);
                }
                elementReferenceCaptureId(e) {
                    const t = Eo(this.batchDataUint8, e + 4);
                    return this.stringReader.readString(t);
                }
                componentId(e) {
                    return Eo(this.batchDataUint8, e + 8);
                }
                elementName(e) {
                    const t = Eo(this.batchDataUint8, e + 8);
                    return this.stringReader.readString(t);
                }
                textContent(e) {
                    const t = Eo(this.batchDataUint8, e + 4);
                    return this.stringReader.readString(t);
                }
                markupContent(e) {
                    const t = Eo(this.batchDataUint8, e + 4);
                    return this.stringReader.readString(t);
                }
                attributeName(e) {
                    const t = Eo(this.batchDataUint8, e + 4);
                    return this.stringReader.readString(t);
                }
                attributeValue(e) {
                    const t = Eo(this.batchDataUint8, e + 8);
                    return this.stringReader.readString(t);
                }
                attributeEventHandlerId(e) {
                    return ko(this.batchDataUint8, e + 12);
                }
            }
            class xo {
                constructor(e) {
                    (this.batchDataUint8 = e), (this.stringTableStartIndex = Eo(e, e.length - 4));
                }
                readString(e) {
                    if (-1 === e) return null;
                    {
                        const n = Eo(this.batchDataUint8, this.stringTableStartIndex + 4 * e),
                            o = (function (e, t) {
                                let n = 0,
                                    o = 0;
                                for (let r = 0; r < 4; r++) {
                                    const i = e[t + r];
                                    if (((n |= (127 & i) << o), i < 128)) break;
                                    o += 7;
                                }
                                return n;
                            })(this.batchDataUint8, n),
                            r = n + ((t = o) < 128 ? 1 : t < 16384 ? 2 : t < 2097152 ? 3 : 4),
                            i = new Uint8Array(this.batchDataUint8.buffer, this.batchDataUint8.byteOffset + r, o);
                        return _o(i);
                    }
                    var t;
                }
            }
            class No {
                constructor(e) {
                    this.batchDataUint8 = e;
                }
                count(e) {
                    return Eo(this.batchDataUint8, e);
                }
                values(e) {
                    return e + 4;
                }
            }
            class Mo {
                constructor(e) {
                    this.batchDataUint8 = e;
                }
                offset(e) {
                    return 0;
                }
                count(e) {
                    return Eo(this.batchDataUint8, e);
                }
                values(e) {
                    return e + 4;
                }
            }
            class Po {
                constructor(e) {
                    (this.nextBatchId = 2), (this.logger = e);
                }
                async processBatch(e, t, n) {
                    if (e < this.nextBatchId) return await this.completeBatch(n, e), void this.logger.log(vt.Debug, `Batch ${e} already processed. Waiting for batch ${this.nextBatchId}.`);
                    if (e > this.nextBatchId)
                        return this.fatalError
                            ? (this.logger.log(vt.Debug, `Received a new batch ${e} but errored out on a previous batch ${this.nextBatchId - 1}`), void (await n.send("OnRenderCompleted", this.nextBatchId - 1, this.fatalError.toString())))
                            : void this.logger.log(vt.Debug, `Waiting for batch ${this.nextBatchId}. Batch ${e} not processed.`);
                    try {
                        this.nextBatchId++, this.logger.log(vt.Debug, `Applying batch ${e}.`), xe(Ln.Server, new To(t)), await this.completeBatch(n, e);
                    } catch (t) {
                        throw ((this.fatalError = t.toString()), this.logger.log(vt.Error, `There was an error applying batch ${e}.`), n.send("OnRenderCompleted", e, t.toString()), t);
                    }
                }
                getLastBatchid() {
                    return this.nextBatchId - 1;
                }
                async completeBatch(e, t) {
                    try {
                        await e.send("OnRenderCompleted", t, null);
                    } catch {
                        this.logger.log(vt.Warning, `Failed to deliver completion notification for render '${t}'.`);
                    }
                }
            }
            let Uo = !1;
            function Lo() {
                const e = document.querySelector("#blazor-error-ui");
                e && (e.style.display = "block"),
                    Uo ||
                        ((Uo = !0),
                        document.querySelectorAll("#blazor-error-ui .reload").forEach((e) => {
                            e.onclick = function (e) {
                                location.reload(), e.preventDefault();
                            };
                        }),
                        document.querySelectorAll("#blazor-error-ui .dismiss").forEach((e) => {
                            e.onclick = function (e) {
                                const t = document.querySelector("#blazor-error-ui");
                                t && (t.style.display = "none"), e.preventDefault();
                            };
                        }));
            }
            class Bo {
                constructor(t, n, o, r) {
                    (this._firstUpdate = !0),
                        (this._renderingFailed = !1),
                        (this._disposed = !1),
                        (this._circuitId = void 0),
                        (this._applicationState = n),
                        (this._componentManager = t),
                        (this._options = o),
                        (this._logger = r),
                        (this._renderQueue = new Po(this._logger)),
                        (this._dispatcher = e.attachDispatcher(this));
                }
                start() {
                    if (this.isDisposedOrDisposing()) throw new Error("Cannot start a disposed circuit.");
                    return this._startPromise || (this._startPromise = this.startCore()), this._startPromise;
                }
                updateRootComponents(e) {
                    var t, n;
                    return this._firstUpdate
                        ? ((this._firstUpdate = !1), null === (t = this._connection) || void 0 === t ? void 0 : t.send("UpdateRootComponents", e, this._applicationState))
                        : null === (n = this._connection) || void 0 === n
                        ? void 0
                        : n.send("UpdateRootComponents", e, "");
                }
                async startCore() {
                    if (((this._connection = await this.startConnection()), this._connection.state !== ln.Connected)) return !1;
                    const e = JSON.stringify(this._componentManager.initialComponents.map((e) => Pt(e)));
                    if (((this._circuitId = await this._connection.invoke("StartCircuit", qe.getBaseURI(), qe.getLocationHref(), e, this._applicationState || "")), !this._circuitId)) return !1;
                    for (const e of this._options.circuitHandlers) e.onCircuitOpened && e.onCircuitOpened();
                    return !0;
                }
                async startConnection() {
                    var e, t;
                    const n = new wo();
                    n.name = "blazorpack";
                    const o = new Un().withUrl("_blazor").withHubProtocol(n);
                    this._options.configureSignalR(o);
                    const r = o.build();
                    r.on("JS.AttachComponent", (e, t) => Ae(Ln.Server, this.resolveElement(t), e, !1)),
                        r.on("JS.BeginInvokeJS", this._dispatcher.beginInvokeJSFromDotNet.bind(this._dispatcher)),
                        r.on("JS.EndInvokeDotNet", this._dispatcher.endInvokeDotNetFromJS.bind(this._dispatcher)),
                        r.on("JS.ReceiveByteArray", this._dispatcher.receiveByteArray.bind(this._dispatcher)),
                        r.on("JS.BeginTransmitStream", (e) => {
                            const t = new ReadableStream({
                                start: (t) => {
                                    r.stream("SendDotNetStreamToJS", e).subscribe({ next: (e) => t.enqueue(e), complete: () => t.close(), error: (e) => t.error(e) });
                                },
                            });
                            this._dispatcher.supplyDotNetStream(e, t);
                        }),
                        r.on("JS.RenderBatch", async (e, t) => {
                            var n, o;
                            this._logger.log(Bt.Debug, `Received render batch with id ${e} and ${t.byteLength} bytes.`),
                                await this._renderQueue.processBatch(e, t, this._connection),
                                null === (o = (n = this._componentManager).onAfterRenderBatch) || void 0 === o || o.call(n, Ln.Server);
                        }),
                        r.on("JS.EndUpdateRootComponents", (e) => {
                            var t, n;
                            null === (n = (t = this._componentManager).onAfterUpdateRootComponents) || void 0 === n || n.call(t, e);
                        }),
                        r.on("JS.EndLocationChanging", mt._internal.navigationManager.endLocationChanging),
                        r.onclose((e) => {
                            (this._interopMethodsForReconnection = (function (e) {
                                const t = C.get(e);
                                if (!t) throw new Error(`Interop methods are not registered for renderer ${e}`);
                                return C.delete(e), t;
                            })(Ln.Server)),
                                this._disposed || this._renderingFailed || this._options.reconnectionHandler.onConnectionDown(this._options.reconnectionOptions, e);
                        }),
                        r.on("JS.Error", (e) => {
                            (this._renderingFailed = !0), this.unhandledError(e), Lo();
                        });
                    try {
                        await r.start();
                    } catch (e) {
                        if ((this.unhandledError(e), "FailedToNegotiateWithServerError" === e.errorType)) throw e;
                        Lo(),
                            e.innerErrors &&
                                (e.innerErrors.some((e) => "UnsupportedTransportError" === e.errorType && e.transport === En.WebSockets)
                                    ? this._logger.log(Bt.Error, "Unable to connect, please ensure you are using an updated browser that supports WebSockets.")
                                    : e.innerErrors.some((e) => "FailedToStartTransportError" === e.errorType && e.transport === En.WebSockets)
                                    ? this._logger.log(Bt.Error, "Unable to connect, please ensure WebSockets are available. A VPN or proxy may be blocking the connection.")
                                    : e.innerErrors.some((e) => "DisabledTransportError" === e.errorType && e.transport === En.LongPolling) &&
                                      this._logger.log(
                                          Bt.Error,
                                          "Unable to initiate a SignalR connection to the server. This might be because the server is not configured to support WebSockets. For additional details, visit https://aka.ms/blazor-server-websockets-error."
                                      ));
                    }
                    return (
                        (null === (t = null === (e = r.connection) || void 0 === e ? void 0 : e.features) || void 0 === t ? void 0 : t.inherentKeepAlive) &&
                            this._logger.log(
                                Bt.Warning,
                                "Failed to connect via WebSockets, using the Long Polling fallback transport. This may be due to a VPN or proxy blocking the connection. To troubleshoot this, visit https://aka.ms/blazor-server-using-fallback-long-polling."
                            ),
                        r
                    );
                }
                async disconnect() {
                    var e;
                    await (null === (e = this._connection) || void 0 === e ? void 0 : e.stop());
                }
                async reconnect() {
                    if (!this._circuitId) throw new Error("Circuit host not initialized.");
                    return (
                        this._connection.state === ln.Connected ||
                        ((this._connection = await this.startConnection()),
                        this._interopMethodsForReconnection && (k(Ln.Server, this._interopMethodsForReconnection), (this._interopMethodsForReconnection = void 0)),
                        !!(await this._connection.invoke("ConnectCircuit", this._circuitId)) && (this._options.reconnectionHandler.onConnectionUp(), !0))
                    );
                }
                beginInvokeDotNetFromJS(e, t, n, o, r) {
                    this.throwIfDispatchingWhenDisposed(), this._connection.send("BeginInvokeDotNetFromJS", e ? e.toString() : null, t, n, o || 0, r);
                }
                endInvokeJSFromDotNet(e, t, n) {
                    this.throwIfDispatchingWhenDisposed(), this._connection.send("EndInvokeJSFromDotNet", e, t, n);
                }
                sendByteArray(e, t) {
                    this.throwIfDispatchingWhenDisposed(), this._connection.send("ReceiveByteArray", e, t);
                }
                throwIfDispatchingWhenDisposed() {
                    if (this._disposed) throw new Error("The circuit associated with this dispatcher is no longer available.");
                }
                sendLocationChanged(e, t, n) {
                    return this._connection.send("OnLocationChanged", e, t, n);
                }
                sendLocationChanging(e, t, n, o) {
                    return this._connection.send("OnLocationChanging", e, t, n, o);
                }
                sendJsDataStream(e, t, n) {
                    return (function (e, t, n, o) {
                        setTimeout(async () => {
                            let r = 5,
                                i = new Date().valueOf();
                            try {
                                const s = t instanceof Blob ? t.size : t.byteLength;
                                let a = 0,
                                    c = 0;
                                for (; a < s; ) {
                                    const l = Math.min(o, s - a),
                                        h = await ft(t, a, l);
                                    if ((r--, r > 1)) await e.send("ReceiveJSDataChunk", n, c, h, null);
                                    else {
                                        if (!(await e.invoke("ReceiveJSDataChunk", n, c, h, null))) break;
                                        const t = new Date().valueOf(),
                                            o = t - i;
                                        (i = t), (r = Math.max(1, Math.round(500 / Math.max(1, o))));
                                    }
                                    (a += l), c++;
                                }
                            } catch (t) {
                                await e.send("ReceiveJSDataChunk", n, -1, null, t.toString());
                            }
                        }, 0);
                    })(this._connection, e, t, n);
                }
                resolveElement(e) {
                    const t = w(e);
                    if (t) return W(t, !0);
                    const n = Number.parseInt(e);
                    if (!Number.isNaN(n)) return H(this._componentManager.resolveRootComponent(n));
                    throw new Error(`Invalid sequence number or identifier '${e}'.`);
                }
                getRootComponentManager() {
                    return this._componentManager;
                }
                unhandledError(e) {
                    this._logger.log(Bt.Error, e), this.disconnect();
                }
                getDisconnectFormData() {
                    const e = new FormData(),
                        t = this._circuitId;
                    return e.append("circuitId", t), e;
                }
                didRenderingFail() {
                    return this._renderingFailed;
                }
                isDisposedOrDisposing() {
                    return void 0 !== this._disposePromise;
                }
                sendDisconnectBeacon() {
                    if (this._disposed) return;
                    const e = this.getDisconnectFormData();
                    this._disposed = navigator.sendBeacon("_blazor/disconnect", e);
                }
                dispose() {
                    return this._disposePromise || (this._disposePromise = this.disposeCore()), this._disposePromise;
                }
                async disposeCore() {
                    var e;
                    if (!this._startPromise) return void (this._disposed = !0);
                    await this._startPromise, (this._disposed = !0), null === (e = this._connection) || void 0 === e || e.stop();
                    const t = this.getDisconnectFormData();
                    fetch("_blazor/disconnect", { method: "POST", body: t });
                    for (const e of this._options.circuitHandlers) e.onCircuitClosed && e.onCircuitClosed();
                }
            }
            function Oo(e) {
                const t = { ...Fo, ...e };
                return e && e.reconnectionOptions && (t.reconnectionOptions = { ...Fo.reconnectionOptions, ...e.reconnectionOptions }), t;
            }
            const Fo = { configureSignalR: (e) => {}, logLevel: vt.Warning, initializers: void 0, circuitHandlers: [], reconnectionOptions: { maxRetries: 8, retryIntervalMilliseconds: 2e4, dialogId: "components-reconnect-modal" } };
            class $o {
                constructor(e, t, n, o) {
                    (this.maxRetries = t),
                        (this.document = n),
                        (this.logger = o),
                        (this.modal = this.document.createElement("div")),
                        (this.modal.id = e),
                        (this.maxRetries = t),
                        (this.modal.style.cssText = [
                            "position: fixed",
                            "top: 0",
                            "right: 0",
                            "bottom: 0",
                            "left: 0",
                            "z-index: 1050",
                            "display: none",
                            "overflow: hidden",
                            "background-color: #fff",
                            "opacity: 0.8",
                            "text-align: center",
                            "font-weight: bold",
                            "transition: visibility 0s linear 500ms",
                        ].join(";")),
                        (this.message = this.document.createElement("h5")),
                        (this.message.style.cssText = "margin-top: 20px"),
                        (this.button = this.document.createElement("button")),
                        (this.button.style.cssText = "margin:5px auto 5px"),
                        (this.button.textContent = "Retry");
                    const r = this.document.createElement("a");
                    r.addEventListener("click", () => location.reload()),
                        (r.textContent = "reload"),
                        (this.reloadParagraph = this.document.createElement("p")),
                        (this.reloadParagraph.textContent = "Alternatively, "),
                        this.reloadParagraph.appendChild(r),
                        this.modal.appendChild(this.message),
                        this.modal.appendChild(this.button),
                        this.modal.appendChild(this.reloadParagraph),
                        (this.loader = this.getLoader()),
                        this.message.after(this.loader),
                        this.button.addEventListener("click", async () => {
                            this.show();
                            try {
                                (await mt.reconnect()) || this.rejected();
                            } catch (e) {
                                this.logger.log(vt.Error, e), this.failed();
                            }
                        });
                }
                show() {
                    this.document.contains(this.modal) || this.document.body.appendChild(this.modal),
                        (this.modal.style.display = "block"),
                        (this.loader.style.display = "inline-block"),
                        (this.button.style.display = "none"),
                        (this.reloadParagraph.style.display = "none"),
                        (this.message.textContent = "Attempting to reconnect to the server..."),
                        (this.modal.style.visibility = "hidden"),
                        setTimeout(() => {
                            this.modal.style.visibility = "visible";
                        }, 0);
                }
                update(e) {
                    this.message.textContent = `Attempting to reconnect to the server: ${e} of ${this.maxRetries}`;
                }
                hide() {
                    this.modal.style.display = "none";
                }
                failed() {
                    (this.button.style.display = "block"), (this.reloadParagraph.style.display = "none"), (this.loader.style.display = "none");
                    const e = this.document.createTextNode("Reconnection failed. Try "),
                        t = this.document.createElement("a");
                    (t.textContent = "reloading"), t.setAttribute("href", ""), t.addEventListener("click", () => location.reload());
                    const n = this.document.createTextNode(" the page if you're unable to reconnect.");
                    this.message.replaceChildren(e, t, n);
                }
                rejected() {
                    (this.button.style.display = "none"), (this.reloadParagraph.style.display = "none"), (this.loader.style.display = "none");
                    const e = this.document.createTextNode("Could not reconnect to the server. "),
                        t = this.document.createElement("a");
                    (t.textContent = "Reload"), t.setAttribute("href", ""), t.addEventListener("click", () => location.reload());
                    const n = this.document.createTextNode(" the page to restore functionality.");
                    this.message.replaceChildren(e, t, n);
                }
                getLoader() {
                    const e = this.document.createElement("div");
                    return (
                        (e.style.cssText = ["border: 0.3em solid #f3f3f3", "border-top: 0.3em solid #3498db", "border-radius: 50%", "width: 2em", "height: 2em", "display: inline-block"].join(";")),
                        e.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 2e3, iterations: 1 / 0 }),
                        e
                    );
                }
            }
            class Ho {
                constructor(e, t, n) {
                    (this.dialog = e), (this.maxRetries = t), (this.document = n), (this.document = n);
                    const o = this.document.getElementById(Ho.MaxRetriesId);
                    o && (o.innerText = this.maxRetries.toString());
                }
                show() {
                    this.removeClasses(), this.dialog.classList.add(Ho.ShowClassName);
                }
                update(e) {
                    const t = this.document.getElementById(Ho.CurrentAttemptId);
                    t && (t.innerText = e.toString());
                }
                hide() {
                    this.removeClasses(), this.dialog.classList.add(Ho.HideClassName);
                }
                failed() {
                    this.removeClasses(), this.dialog.classList.add(Ho.FailedClassName);
                }
                rejected() {
                    this.removeClasses(), this.dialog.classList.add(Ho.RejectedClassName);
                }
                removeClasses() {
                    this.dialog.classList.remove(Ho.ShowClassName, Ho.HideClassName, Ho.FailedClassName, Ho.RejectedClassName);
                }
            }
            (Ho.ShowClassName = "components-reconnect-show"),
                (Ho.HideClassName = "components-reconnect-hide"),
                (Ho.FailedClassName = "components-reconnect-failed"),
                (Ho.RejectedClassName = "components-reconnect-rejected"),
                (Ho.MaxRetriesId = "components-reconnect-max-retries"),
                (Ho.CurrentAttemptId = "components-reconnect-current-attempt");
            class Wo {
                constructor(e, t, n) {
                    (this._currentReconnectionProcess = null), (this._logger = e), (this._reconnectionDisplay = t), (this._reconnectCallback = n || mt.reconnect);
                }
                onConnectionDown(e, t) {
                    if (!this._reconnectionDisplay) {
                        const t = document.getElementById(e.dialogId);
                        this._reconnectionDisplay = t ? new Ho(t, e.maxRetries, document) : new $o(e.dialogId, e.maxRetries, document, this._logger);
                    }
                    this._currentReconnectionProcess || (this._currentReconnectionProcess = new jo(e, this._logger, this._reconnectCallback, this._reconnectionDisplay));
                }
                onConnectionUp() {
                    this._currentReconnectionProcess && (this._currentReconnectionProcess.dispose(), (this._currentReconnectionProcess = null));
                }
            }
            class jo {
                constructor(e, t, n, o) {
                    (this.logger = t), (this.reconnectCallback = n), (this.isDisposed = !1), (this.reconnectDisplay = o), this.reconnectDisplay.show(), this.attemptPeriodicReconnection(e);
                }
                dispose() {
                    (this.isDisposed = !0), this.reconnectDisplay.hide();
                }
                async attemptPeriodicReconnection(e) {
                    for (let t = 0; t < e.maxRetries; t++) {
                        this.reconnectDisplay.update(t + 1);
                        const n = 0 === t && e.retryIntervalMilliseconds > jo.MaximumFirstRetryInterval ? jo.MaximumFirstRetryInterval : e.retryIntervalMilliseconds;
                        if ((await this.delay(n), this.isDisposed)) break;
                        try {
                            return (await this.reconnectCallback()) ? void 0 : void this.reconnectDisplay.rejected();
                        } catch (e) {
                            this.logger.log(vt.Error, e);
                        }
                    }
                    this.reconnectDisplay.failed();
                }
                delay(e) {
                    return new Promise((t) => setTimeout(t, e));
                }
            }
            jo.MaximumFirstRetryInterval = 3e3;
            class zo {
                constructor(e = !0, t, n, o = 0) {
                    (this.singleRuntime = e), (this.logger = t), (this.webRendererId = o), (this.afterStartedCallbacks = []), n && this.afterStartedCallbacks.push(...n);
                }
                async importInitializersAsync(e, t) {
                    await Promise.all(
                        e.map((e) =>
                            (async function (e, n) {
                                const o = (function (e) {
                                        const t = document.baseURI;
                                        return t.endsWith("/") ? `${t}${e}` : `${t}/${e}`;
                                    })(n),
                                    r = await import(o);
                                if (void 0 !== r) {
                                    if (e.singleRuntime) {
                                        const { beforeStart: n, afterStarted: o, beforeWebAssemblyStart: s, afterWebAssemblyStarted: a, beforeServerStart: c, afterServerStarted: l } = r;
                                        let h = n;
                                        e.webRendererId === Ln.Server && c && (h = c), e.webRendererId === Ln.WebAssembly && s && (h = s);
                                        let d = o;
                                        return e.webRendererId === Ln.Server && l && (d = l), e.webRendererId === Ln.WebAssembly && a && (d = a), i(e, h, d, t);
                                    }
                                    return (function (e, t, n) {
                                        var r;
                                        const s = n[0],
                                            { beforeStart: a, afterStarted: c, beforeWebStart: l, afterWebStarted: h, beforeWebAssemblyStart: d, afterWebAssemblyStarted: u, beforeServerStart: p, afterServerStarted: f } = t,
                                            g = !(l || h || d || u || p || f || (!a && !c)),
                                            m = g && s.enableClassicInitializers;
                                        if (g && !s.enableClassicInitializers)
                                            null === (r = e.logger) ||
                                                void 0 === r ||
                                                r.log(vt.Warning, `Initializer '${o}' will be ignored because multiple runtimes are available. Use 'before(Web|WebAssembly|Server)Start' and 'after(Web|WebAssembly|Server)Started' instead.`);
                                        else if (m) return i(e, a, c, n);
                                        if (
                                            ((function (e) {
                                                e.webAssembly ? e.webAssembly.initializers || (e.webAssembly.initializers = { beforeStart: [], afterStarted: [] }) : (e.webAssembly = { initializers: { beforeStart: [], afterStarted: [] } }),
                                                    e.circuit ? e.circuit.initializers || (e.circuit.initializers = { beforeStart: [], afterStarted: [] }) : (e.circuit = { initializers: { beforeStart: [], afterStarted: [] } });
                                            })(s),
                                            d && s.webAssembly.initializers.beforeStart.push(d),
                                            u && s.webAssembly.initializers.afterStarted.push(u),
                                            p && s.circuit.initializers.beforeStart.push(p),
                                            f && s.circuit.initializers.afterStarted.push(f),
                                            h && e.afterStartedCallbacks.push(h),
                                            l)
                                        )
                                            return l(s);
                                    })(e, r, t);
                                }
                                function i(e, t, n, o) {
                                    if ((n && e.afterStartedCallbacks.push(n), t)) return t(...o);
                                }
                            })(this, e)
                        )
                    );
                }
                async invokeAfterStartedCallbacks(e) {
                    const t = (function (e) {
                        var t;
                        return null === (t = I.get(e)) || void 0 === t ? void 0 : t[1];
                    })(this.webRendererId);
                    t && (await t), await Promise.all(this.afterStartedCallbacks.map((t) => t(e)));
                }
            }
            let qo, Jo, Ko, Vo, Xo, Go, Yo, Qo;
            function Zo(e) {
                if (Vo) throw new Error("Circuit options have already been configured.");
                if (Vo) throw new Error("WebAssembly options have already been configured.");
                qo = (async function (e) {
                    const t = await e;
                    Vo = Oo(t);
                })(e);
            }
            function er(e) {
                if (void 0 !== Go) throw new Error("Blazor Server has already started.");
                return (Go = new Promise(tr.bind(null, e))), Go;
            }
            async function tr(e, t, n) {
                await qo;
                const o = await (async function (e) {
                    if (e.initializers) return await Promise.all(e.initializers.beforeStart.map((t) => t(e))), new zo(!1, void 0, e.initializers.afterStarted, Ln.Server);
                    const t = await fetch("_blazor/initializers", { method: "GET", credentials: "include", cache: "no-cache" }),
                        n = await t.json(),
                        o = new zo(!0, void 0, void 0, Ln.Server);
                    return await o.importInitializersAsync(n, [e]), o;
                })(Vo);
                if (
                    ((Jo = Et(document) || ""),
                    (Xo = new wt(Vo.logLevel)),
                    (Ko = new Bo(e, Jo, Vo, Xo)),
                    Xo.log(vt.Information, "Starting up Blazor server-side application."),
                    (mt.reconnect = async () =>
                        !(
                            Ko.didRenderingFail() ||
                            (!(await Ko.reconnect()) && (Xo.log(vt.Information, "Reconnection attempt to the circuit was rejected by the server. This may indicate that the associated state is no longer available on the server."), 1))
                        )),
                    (mt.defaultReconnectionHandler = new Wo(Xo)),
                    (Vo.reconnectionHandler = Vo.reconnectionHandler || mt.defaultReconnectionHandler),
                    mt._internal.navigationManager.listenForNavigationEvents(
                        Ln.Server,
                        (e, t, n) => Ko.sendLocationChanged(e, t, n),
                        (e, t, n, o) => Ko.sendLocationChanging(e, t, n, o)
                    ),
                    (mt._internal.forceCloseConnection = () => Ko.disconnect()),
                    (mt._internal.sendJSDataStream = (e, t, n) => Ko.sendJsDataStream(e, t, n)),
                    !(await Ko.start()))
                )
                    return Xo.log(vt.Error, "Failed to start the circuit."), void t();
                const r = () => {
                    Ko.sendDisconnectBeacon();
                };
                (mt.disconnect = r), window.addEventListener("unload", r, { capture: !1, once: !0 }), Xo.log(vt.Information, "Blazor server-side application started."), o.invokeAfterStartedCallbacks(mt), t();
            }
            async function nr() {
                if (!Go) throw new Error("Cannot start the circuit until Blazor Server has started.");
                return (
                    !(!Ko || Ko.isDisposedOrDisposing()) ||
                    (Yo
                        ? await Yo
                        : (await Go,
                          (!Ko || !Ko.didRenderingFail()) &&
                              (Ko && Ko.isDisposedOrDisposing() && ((Jo = Et(document) || ""), (Ko = new Bo(Ko.getRootComponentManager(), Jo, Vo, Xo))),
                              (Yo = Ko.start()),
                              (async function (e) {
                                  await e, Yo === e && (Yo = void 0);
                              })(Yo),
                              Yo)))
                );
            }
            function or(e) {
                if (Ko && !Ko.isDisposedOrDisposing()) return Ko.updateRootComponents(e);
                !(async function (e) {
                    await Go, (await nr()) && Ko.updateRootComponents(e);
                })(e);
            }
            function rr(e) {
                return (Qo = e), Qo;
            }
            var ir, sr;
            const ar = navigator,
                cr = ar.userAgentData && ar.userAgentData.brands,
                lr = cr && cr.length > 0 ? cr.some((e) => "Google Chrome" === e.brand || "Microsoft Edge" === e.brand || "Chromium" === e.brand) : window.chrome,
                hr = null !== (sr = null === (ir = ar.userAgentData) || void 0 === ir ? void 0 : ir.platform) && void 0 !== sr ? sr : navigator.platform;
            function dr(e) {
                return 0 !== e.debugLevel && (lr || navigator.userAgent.includes("Firefox"));
            }
            let ur, pr, fr, gr, mr, vr, yr;
            const wr = Math.pow(2, 32),
                br = Math.pow(2, 21) - 1;
            let _r = null;
            function Sr(e) {
                return pr.getI32(e);
            }
            const Cr = {
                load: function (e, t) {
                    return (async function (e, t) {
                        const { dotnet: n } = await (async function (e) {
                                if ("undefined" == typeof WebAssembly || !WebAssembly.validate) throw new Error("This browser does not support WebAssembly.");
                                let t = "_framework/dotnet.js";
                                if (e.loadBootResource) {
                                    const n = "dotnetjs",
                                        o = e.loadBootResource(n, "dotnet.js", t, "", "js-module-dotnet");
                                    if ("string" == typeof o) t = o;
                                    else if (o) throw new Error(`For a ${n} resource, custom loaders must supply a URI string.`);
                                }
                                const n = new URL(t, document.baseURI).toString();
                                return await import(n);
                            })(e),
                            o = (function (e, t) {
                                const n = { maxParallelDownloads: 1e6, enableDownloadRetry: !1, applicationEnvironment: e.environment },
                                    o = {
                                        ...(window.Module || {}),
                                        onConfigLoaded: async (n) => {
                                            n.environmentVariables || (n.environmentVariables = {}),
                                                "sharded" === n.globalizationMode && (n.environmentVariables.__BLAZOR_SHARDED_ICU = "1"),
                                                (mt._internal.getApplicationEnvironment = () => n.applicationEnvironment),
                                                null == t || t(n),
                                                (yr = await (async function (e, t) {
                                                    var n, o, r;
                                                    if (e.initializers) return await Promise.all(e.initializers.beforeStart.map((t) => t(e))), new zo(!1, void 0, e.initializers.afterStarted, Ln.WebAssembly);
                                                    {
                                                        const i = [e, null !== (o = null === (n = t.resources) || void 0 === n ? void 0 : n.extensions) && void 0 !== o ? o : {}],
                                                            s = new zo(!0, void 0, void 0, Ln.WebAssembly),
                                                            a = Object.keys((null === (r = null == t ? void 0 : t.resources) || void 0 === r ? void 0 : r.libraryInitializers) || {});
                                                        return await s.importInitializersAsync(a, i), s;
                                                    }
                                                })(e, n));
                                        },
                                        onDownloadResourceProgress: Er,
                                        config: n,
                                        disableDotnet6Compatibility: !1,
                                        out: kr,
                                        err: Tr,
                                    };
                                return o;
                            })(e, t);
                        e.applicationCulture && n.withApplicationCulture(e.applicationCulture),
                            e.environment && n.withApplicationEnvironment(e.environment),
                            e.loadBootResource && n.withResourceLoader(e.loadBootResource),
                            n.withModuleConfig(o),
                            e.configureRuntime && e.configureRuntime(n),
                            (vr = await n.create());
                    })(e, t);
                },
                start: function () {
                    return (async function () {
                        if (!vr) throw new Error("The runtime must be loaded it gets configured.");
                        const { MONO: t, BINDING: n, Module: o, setModuleImports: r, INTERNAL: i, getConfig: s, invokeLibraryInitializers: a } = vr;
                        (fr = o),
                            (ur = n),
                            (pr = t),
                            (mr = i),
                            (function (e) {
                                const t = hr.match(/^Mac/i) ? "Cmd" : "Alt";
                                dr(e) && console.info(`Debugging hotkey: Shift+${t}+D (when application has focus)`),
                                    document.addEventListener("keydown", (t) => {
                                        t.shiftKey &&
                                            (t.metaKey || t.altKey) &&
                                            "KeyD" === t.code &&
                                            (dr(e)
                                                ? navigator.userAgent.includes("Firefox")
                                                    ? (async function () {
                                                          const e = await fetch(`_framework/debug?url=${encodeURIComponent(location.href)}&isFirefox=true`);
                                                          200 !== e.status && console.warn(await e.text());
                                                      })()
                                                    : lr
                                                    ? (function () {
                                                          const e = document.createElement("a");
                                                          (e.href = `_framework/debug?url=${encodeURIComponent(location.href)}`), (e.target = "_blank"), (e.rel = "noopener noreferrer"), e.click();
                                                      })()
                                                    : console.error("Currently, only Microsoft Edge (80+), Google Chrome, or Chromium, are supported for debugging.")
                                                : console.error("Cannot start debugging, because the application was not compiled with debugging enabled."));
                                    });
                            })(s()),
                            (mt.runtime = vr),
                            (mt._internal.dotNetCriticalError = Tr),
                            r("blazor-internal", { Blazor: { _internal: mt._internal } });
                        const c = await vr.getAssemblyExports("Microsoft.AspNetCore.Components.WebAssembly");
                        return (
                            Object.assign(mt._internal, { dotNetExports: { ...c.Microsoft.AspNetCore.Components.WebAssembly.Services.DefaultWebAssemblyJSRuntime } }),
                            (gr = e.attachDispatcher({
                                beginInvokeDotNetFromJS: (e, t, n, o, r) => {
                                    if ((Ar(), !o && !t)) throw new Error("Either assemblyName or dotNetObjectId must have a non null value.");
                                    const i = o ? o.toString() : t;
                                    mt._internal.dotNetExports.BeginInvokeDotNet(e ? e.toString() : null, i, n, r);
                                },
                                endInvokeJSFromDotNet: (e, t, n) => {
                                    mt._internal.dotNetExports.EndInvokeJS(n);
                                },
                                sendByteArray: (e, t) => {
                                    mt._internal.dotNetExports.ReceiveByteArrayFromJS(e, t);
                                },
                                invokeDotNetFromJS: (e, t, n, o) => (Ar(), mt._internal.dotNetExports.InvokeDotNet(e || null, t, null != n ? n : 0, o)),
                            })),
                            { invokeLibraryInitializers: a }
                        );
                    })();
                },
                callEntryPoint: async function () {
                    try {
                        await vr.runMain(vr.getConfig().mainAssemblyName, []);
                    } catch (e) {
                        console.error(e), Lo();
                    }
                },
                toUint8Array: function (e) {
                    const t = Rr(e),
                        n = Sr(t),
                        o = new Uint8Array(n);
                    return o.set(fr.HEAPU8.subarray(t + 4, t + 4 + n)), o;
                },
                getArrayLength: function (e) {
                    return Sr(Rr(e));
                },
                getArrayEntryPtr: function (e, t, n) {
                    return Rr(e) + 4 + t * n;
                },
                getObjectFieldsBaseAddress: function (e) {
                    return e + 8;
                },
                readInt16Field: function (e, t) {
                    return (n = e + (t || 0)), pr.getI16(n);
                    var n;
                },
                readInt32Field: function (e, t) {
                    return Sr(e + (t || 0));
                },
                readUint64Field: function (e, t) {
                    return (function (e) {
                        const t = e >> 2,
                            n = fr.HEAPU32[t + 1];
                        if (n > br) throw new Error(`Cannot read uint64 with high order part ${n}, because the result would exceed Number.MAX_SAFE_INTEGER.`);
                        return n * wr + fr.HEAPU32[t];
                    })(e + (t || 0));
                },
                readFloatField: function (e, t) {
                    return (n = e + (t || 0)), pr.getF32(n);
                    var n;
                },
                readObjectField: function (e, t) {
                    return Sr(e + (t || 0));
                },
                readStringField: function (e, t, n) {
                    const o = Sr(e + (t || 0));
                    if (0 === o) return null;
                    if (n) {
                        const e = ur.unbox_mono_obj(o);
                        return "boolean" == typeof e ? (e ? "" : null) : e;
                    }
                    return ur.conv_string(o);
                },
                readStructField: function (e, t) {
                    return e + (t || 0);
                },
                beginHeapLock: function () {
                    return Ar(), (_r = Dr.create()), _r;
                },
                invokeWhenHeapUnlocked: function (e) {
                    _r ? _r.enqueuePostReleaseAction(e) : e();
                },
            };
            function Er(e, t) {
                const n = (e / t) * 100;
                document.documentElement.style.setProperty("--blazor-load-percentage", `${n}%`), document.documentElement.style.setProperty("--blazor-load-percentage-text", `"${Math.floor(n)}%"`);
            }
            const Ir = ["DEBUGGING ENABLED"],
                kr = (e) => Ir.indexOf(e) < 0 && console.log(e),
                Tr = (e) => {
                    console.error(e || "(null)"), Lo();
                };
            function Rr(e) {
                return e + 12;
            }
            function Ar() {
                if (_r) throw new Error("Assertion failed - heap is currently locked");
            }
            class Dr {
                enqueuePostReleaseAction(e) {
                    this.postReleaseActions || (this.postReleaseActions = []), this.postReleaseActions.push(e);
                }
                release() {
                    var e;
                    if (_r !== this) throw new Error("Trying to release a lock which isn't current");
                    for (mr.mono_wasm_gc_unlock(), _r = null; null === (e = this.postReleaseActions) || void 0 === e ? void 0 : e.length; ) this.postReleaseActions.shift()(), Ar();
                }
                static create() {
                    return mr.mono_wasm_gc_lock(), new Dr();
                }
            }
            class xr {
                constructor(e) {
                    (this.batchAddress = e), (this.arrayRangeReader = Nr), (this.arrayBuilderSegmentReader = Mr), (this.diffReader = Pr), (this.editReader = Ur), (this.frameReader = Lr);
                }
                updatedComponents() {
                    return Qo.readStructField(this.batchAddress, 0);
                }
                referenceFrames() {
                    return Qo.readStructField(this.batchAddress, Nr.structLength);
                }
                disposedComponentIds() {
                    return Qo.readStructField(this.batchAddress, 2 * Nr.structLength);
                }
                disposedEventHandlerIds() {
                    return Qo.readStructField(this.batchAddress, 3 * Nr.structLength);
                }
                updatedComponentsEntry(e, t) {
                    return Br(e, t, Pr.structLength);
                }
                referenceFramesEntry(e, t) {
                    return Br(e, t, Lr.structLength);
                }
                disposedComponentIdsEntry(e, t) {
                    const n = Br(e, t, 4);
                    return Qo.readInt32Field(n);
                }
                disposedEventHandlerIdsEntry(e, t) {
                    const n = Br(e, t, 8);
                    return Qo.readUint64Field(n);
                }
            }
            const Nr = { structLength: 8, values: (e) => Qo.readObjectField(e, 0), count: (e) => Qo.readInt32Field(e, 4) },
                Mr = {
                    structLength: 12,
                    values: (e) => {
                        const t = Qo.readObjectField(e, 0),
                            n = Qo.getObjectFieldsBaseAddress(t);
                        return Qo.readObjectField(n, 0);
                    },
                    offset: (e) => Qo.readInt32Field(e, 4),
                    count: (e) => Qo.readInt32Field(e, 8),
                },
                Pr = { structLength: 4 + Mr.structLength, componentId: (e) => Qo.readInt32Field(e, 0), edits: (e) => Qo.readStructField(e, 4), editsEntry: (e, t) => Br(e, t, Ur.structLength) },
                Ur = {
                    structLength: 20,
                    editType: (e) => Qo.readInt32Field(e, 0),
                    siblingIndex: (e) => Qo.readInt32Field(e, 4),
                    newTreeIndex: (e) => Qo.readInt32Field(e, 8),
                    moveToSiblingIndex: (e) => Qo.readInt32Field(e, 8),
                    removedAttributeName: (e) => Qo.readStringField(e, 16),
                },
                Lr = {
                    structLength: 36,
                    frameType: (e) => Qo.readInt16Field(e, 4),
                    subtreeLength: (e) => Qo.readInt32Field(e, 8),
                    elementReferenceCaptureId: (e) => Qo.readStringField(e, 16),
                    componentId: (e) => Qo.readInt32Field(e, 12),
                    elementName: (e) => Qo.readStringField(e, 16),
                    textContent: (e) => Qo.readStringField(e, 16),
                    markupContent: (e) => Qo.readStringField(e, 16),
                    attributeName: (e) => Qo.readStringField(e, 16),
                    attributeValue: (e) => Qo.readStringField(e, 24, !0),
                    attributeEventHandlerId: (e) => Qo.readUint64Field(e, 8),
                };
            function Br(e, t, n) {
                return Qo.getArrayEntryPtr(e, t, n);
            }
            class Or {
                constructor(e) {
                    this.componentManager = e;
                }
                resolveRegisteredElement(e) {
                    const t = Number.parseInt(e);
                    if (!Number.isNaN(t)) return H(this.componentManager.resolveRootComponent(t));
                }
                getParameterValues(e) {
                    return this.componentManager.initialComponents[e].parameterValues;
                }
                getParameterDefinitions(e) {
                    return this.componentManager.initialComponents[e].parameterDefinitions;
                }
                getTypeName(e) {
                    return this.componentManager.initialComponents[e].typeName;
                }
                getAssembly(e) {
                    return this.componentManager.initialComponents[e].assembly;
                }
                getCount() {
                    return this.componentManager.initialComponents.length;
                }
            }
            let Fr,
                $r,
                Hr,
                Wr,
                jr,
                zr = !1,
                qr = !1,
                Jr = !0,
                Kr = !1;
            const Vr = new Promise((e) => {
                jr = e;
            });
            let Xr;
            const Gr = new Promise((e) => {
                Xr = e;
            });
            let Yr;
            function Qr(e) {
                if (void 0 !== Wr) throw new Error("Blazor WebAssembly has already started.");
                return (Wr = new Promise(Zr.bind(null, e))), Wr;
            }
            async function Zr(e, t, n) {
                (function () {
                    if (window.parent !== window && !window.opener && window.frameElement) {
                        const e = window.sessionStorage && window.sessionStorage["Microsoft.AspNetCore.Components.WebAssembly.Authentication.CachedAuthSettings"],
                            t = e && JSON.parse(e);
                        return t && t.redirect_uri && location.href.startsWith(t.redirect_uri);
                    }
                    return !1;
                })() && (await new Promise(() => {}));
                const o = ei();
                !(function (e) {
                    const t = D;
                    D = (e, n, o) => {
                        ((e, t, n) => {
                            const o = De(e);
                            (null == o ? void 0 : o.eventDelegator.getHandler(t)) && Cr.invokeWhenHeapUnlocked(n);
                        })(e, n, () => t(e, n, o));
                    };
                })(),
                    (mt._internal.applyHotReload = (e, t, n, o) => {
                        gr.invokeDotNetStaticMethod("Microsoft.AspNetCore.Components.WebAssembly", "ApplyHotReloadDelta", e, t, n, o);
                    }),
                    (mt._internal.getApplyUpdateCapabilities = () => gr.invokeDotNetStaticMethod("Microsoft.AspNetCore.Components.WebAssembly", "GetApplyUpdateCapabilities")),
                    (mt._internal.invokeJSFromDotNet = ni),
                    (mt._internal.invokeJSJson = oi),
                    (mt._internal.endInvokeDotNetFromJS = ri),
                    (mt._internal.receiveWebAssemblyDotNetDataStream = ii),
                    (mt._internal.receiveByteArray = si);
                const r = rr(Cr);
                (mt.platform = r),
                    (mt._internal.renderBatch = (e, t) => {
                        const n = Cr.beginHeapLock();
                        try {
                            xe(e, new xr(t));
                        } finally {
                            n.release();
                        }
                    }),
                    mt._internal.navigationManager.listenForNavigationEvents(
                        Ln.WebAssembly,
                        async (e, t, n) => {
                            await gr.invokeDotNetStaticMethodAsync("Microsoft.AspNetCore.Components.WebAssembly", "NotifyLocationChanged", e, t, n);
                        },
                        async (e, t, n, o) => {
                            const r = await gr.invokeDotNetStaticMethodAsync("Microsoft.AspNetCore.Components.WebAssembly", "NotifyLocationChangingAsync", t, n, o);
                            mt._internal.navigationManager.endLocationChanging(e, r);
                        }
                    );
                const i = new Or(e);
                let s;
                (mt._internal.registeredComponents = {
                    getRegisteredComponentsCount: () => i.getCount(),
                    getAssembly: (e) => i.getAssembly(e),
                    getTypeName: (e) => i.getTypeName(e),
                    getParameterDefinitions: (e) => i.getParameterDefinitions(e) || "",
                    getParameterValues: (e) => i.getParameterValues(e) || "",
                }),
                    (mt._internal.getPersistedState = () => It(document, St) || ""),
                    (mt._internal.getInitialComponentsUpdate = () => Gr),
                    (mt._internal.updateRootComponents = (e) => {
                        var t;
                        return null === (t = mt._internal.dotNetExports) || void 0 === t ? void 0 : t.UpdateRootComponentsCore(e);
                    }),
                    (mt._internal.endUpdateRootComponents = (t) => {
                        var n;
                        return null === (n = e.onAfterUpdateRootComponents) || void 0 === n ? void 0 : n.call(e, t);
                    }),
                    (mt._internal.attachRootComponentToElement = (e, t, n) => {
                        const o = i.resolveRegisteredElement(e);
                        o
                            ? Ae(n, o, t, !1)
                            : (function (e, t, n) {
                                  const o = "::before";
                                  let r = !1;
                                  if (e.endsWith("::after")) (e = e.slice(0, -7)), (r = !0);
                                  else if (e.endsWith(o)) throw new Error(`The '${o}' selector is not supported.`);
                                  const i = w(e) || document.querySelector(e);
                                  if (!i) throw new Error(`Could not find any element matching selector '${e}'.`);
                                  Ae(n, W(i, !0), t, r);
                              })(e, t, n);
                    });
                try {
                    await o, (s = await r.start());
                } catch (e) {
                    throw new Error(`Failed to start platform. Reason: ${e}`);
                }
                r.callEntryPoint(), yr.invokeAfterStartedCallbacks(mt), (qr = !0), t();
            }
            function ei() {
                return (
                    null != Hr ||
                        (Hr = (async () => {
                            await $r;
                            const e = null != Fr ? Fr : {},
                                t = null == Fr ? void 0 : Fr.configureRuntime;
                            (e.configureRuntime = (e) => {
                                null == t || t(e), Kr && e.withEnvironmentVariable("__BLAZOR_WEBASSEMBLY_WAIT_FOR_ROOT_COMPONENTS", "true");
                            }),
                                await Cr.load(e, jr),
                                (zr = !0);
                        })()),
                    Hr
                );
            }
            function ti() {
                return zr;
            }
            function ni(t, n, o, r) {
                const i = Cr.readStringField(t, 0),
                    s = Cr.readInt32Field(t, 4),
                    a = Cr.readStringField(t, 8),
                    c = Cr.readUint64Field(t, 20);
                if (null !== a) {
                    const e = Cr.readUint64Field(t, 12);
                    if (0 !== e) return gr.beginInvokeJSFromDotNet(e, i, a, s, c), 0;
                    {
                        const e = gr.invokeJSFromDotNet(i, a, s, c);
                        return null === e ? 0 : ur.js_string_to_mono_string(e);
                    }
                }
                {
                    const t = e.findJSFunction(i, c).call(null, n, o, r);
                    switch (s) {
                        case e.JSCallResultType.Default:
                            return t;
                        case e.JSCallResultType.JSObjectReference:
                            return e.createJSObjectReference(t).__jsObjectId;
                        case e.JSCallResultType.JSStreamReference: {
                            const n = e.createJSStreamReference(t),
                                o = JSON.stringify(n);
                            return ur.js_string_to_mono_string(o);
                        }
                        case e.JSCallResultType.JSVoidResult:
                            return null;
                        default:
                            throw new Error(`Invalid JS call result type '${s}'.`);
                    }
                }
            }
            function oi(e, t, n, o, r) {
                return 0 !== r ? (gr.beginInvokeJSFromDotNet(r, e, o, n, t), null) : gr.invokeJSFromDotNet(e, o, n, t);
            }
            function ri(e, t, n) {
                gr.endInvokeDotNetFromJS(e, t, n);
            }
            function ii(e, t, n, o) {
                !(function (e, t, n, o, r) {
                    let i = gt.get(t);
                    if (!i) {
                        const n = new ReadableStream({
                            start(e) {
                                gt.set(t, e), (i = e);
                            },
                        });
                        e.supplyDotNetStream(t, n);
                    }
                    r ? (i.error(r), gt.delete(t)) : 0 === o ? (i.close(), gt.delete(t)) : i.enqueue(n.length === o ? n : n.subarray(0, o));
                })(gr, e, t, n, o);
            }
            function si(e, t) {
                gr.receiveByteArray(e, t);
            }
            function ai(e, t) {
                t.namespaceURI ? e.setAttributeNS(t.namespaceURI, t.name, t.value) : e.setAttribute(t.name, t.value);
            }
            $r = new Promise((e) => {
                Yr = e;
            });
            const ci = "data-permanent";
            var li, hi;
            !(function (e) {
                (e[(e.None = 0)] = "None"), (e[(e.Some = 1)] = "Some"), (e[(e.Infinite = 2)] = "Infinite");
            })(li || (li = {})),
                (function (e) {
                    (e.Keep = "keep"), (e.Update = "update"), (e.Insert = "insert"), (e.Delete = "delete");
                })(hi || (hi = {}));
            class di {
                static create(e, t, n) {
                    return 0 === t && n === e.length ? e : new di(e, t, n);
                }
                constructor(e, t, n) {
                    (this.source = e), (this.startIndex = t), (this.length = n);
                }
                item(e) {
                    return this.source.item(e + this.startIndex);
                }
                forEach(e, t) {
                    for (let t = 0; t < this.length; t++) e(this.item(t), t, this);
                }
            }
            let ui = null;
            function pi(e, t) {
                wi(t), fi(e, t);
            }
            function fi(e, t) {
                var n;
                let o;
                o = e instanceof Node ? e : null !== (n = K(e.startExclusive)) && void 0 !== n ? n : e.startExclusive.parentNode;
                const r = Z(o) || Z(t);
                let i, s;
                r && (W(o, !0), W(t, !0)), r ? ((i = new Ci(o)), (s = new Ci(t))) : ((i = o.childNodes), (s = t.childNodes)), e instanceof Node || (i = new Si(i, e));
                const a = (function (e, t, n) {
                    const o = (function (e, t, n) {
                        const o = Math.min(e.length, t.length);
                        for (let r = 0; r < o; r++) if (n(e.item(r), t.item(r)) !== li.None) return r;
                        return o;
                    })(e, t, n);
                    if (o === e.length && o === t.length) return { skipCount: o };
                    const r = (function (e, t, n, o, r) {
                            let i = e.length - 1,
                                s = t.length - 1,
                                a = 0;
                            for (; i >= n && s >= o && r(e.item(i), t.item(s)) === li.None; ) i--, s--, a++;
                            return a;
                        })(e, t, o, o, n),
                        i = (function (e) {
                            var t;
                            const n = [];
                            let o = e.length - 1,
                                r = (null === (t = e[o]) || void 0 === t ? void 0 : t.length) - 1;
                            for (; o > 0 || r > 0; ) {
                                const t = 0 === o ? hi.Insert : 0 === r ? hi.Delete : e[o][r];
                                switch ((n.unshift(t), t)) {
                                    case hi.Keep:
                                    case hi.Update:
                                        o--, r--;
                                        break;
                                    case hi.Insert:
                                        r--;
                                        break;
                                    case hi.Delete:
                                        o--;
                                }
                            }
                            return n;
                        })(
                            (function (e, t, n) {
                                const o = [],
                                    r = [],
                                    i = e.length,
                                    s = t.length;
                                if (0 === i && 0 === s) return [];
                                for (let e = 0; e <= i; e++) ((o[e] = Array(s + 1))[0] = e), (r[e] = Array(s + 1));
                                const a = o[0];
                                for (let e = 1; e <= s; e++) a[e] = e;
                                for (let a = 1; a <= i; a++)
                                    for (let i = 1; i <= s; i++) {
                                        const s = n(e.item(a - 1), t.item(i - 1)),
                                            c = o[a - 1][i] + 1,
                                            l = o[a][i - 1] + 1;
                                        let h;
                                        switch (s) {
                                            case li.None:
                                                h = o[a - 1][i - 1];
                                                break;
                                            case li.Some:
                                                h = o[a - 1][i - 1] + 1;
                                                break;
                                            case li.Infinite:
                                                h = Number.MAX_VALUE;
                                        }
                                        h < l && h < c ? ((o[a][i] = h), (r[a][i] = s === li.None ? hi.Keep : hi.Update)) : l < c ? ((o[a][i] = l), (r[a][i] = hi.Insert)) : ((o[a][i] = c), (r[a][i] = hi.Delete));
                                    }
                                return r;
                            })((e = di.create(e, o, e.length - o - r)), (t = di.create(t, o, t.length - o - r)), n)
                        );
                    return { skipCount: o, edits: i };
                })(i, s, yi);
                let c, l;
                r ? ((c = new _i(i.item(0))), (l = new _i(s.item(0)))) : ((c = new bi(i.item(0))), (l = new bi(s.item(0))));
                for (let e = 0; e < a.skipCount; e++) gi(c.current, l.current), c.advance(), l.advance();
                if (a.edits) {
                    const t = a.edits,
                        n = t.length;
                    for (let e = 0; e < n; e++) {
                        const n = t[e];
                        switch (n) {
                            case hi.Keep:
                                gi(c.current, l.current), c.advance(), l.advance();
                                break;
                            case hi.Update:
                                mi(c.current, l.current), c.advance(), l.advance();
                                break;
                            case hi.Delete: {
                                const e = c.current;
                                c.advance(), (h = e), Z((d = o)) ? q(h, W(document.createDocumentFragment()), 0) : d.removeChild(h);
                                break;
                            }
                            case hi.Insert: {
                                const e = l.current;
                                l.advance(), vi(e, c.current, o);
                                break;
                            }
                            default:
                                throw new Error(`Unexpected operation: '${n}'`);
                        }
                    }
                    const r = e instanceof Node ? null : e.endExclusive;
                    for (; c.current !== r; ) gi(c.current, l.current), c.advance(), l.advance();
                    if (l.current) throw new Error("Updating the DOM failed because the sets of trailing nodes had inconsistent lengths.");
                }
                var h, d;
            }
            function gi(e, t) {
                switch (e.nodeType) {
                    case Node.TEXT_NODE:
                        break;
                    case Node.COMMENT_NODE: {
                        const n = e,
                            o = t,
                            r = X(n),
                            i = X(o);
                        if (!r != !i) throw new Error("Not supported: merging component comment nodes with non-component comment nodes");
                        r &&
                            ((function (e, t) {
                                if (!Ut(e, t)) throw new Error(`Cannot merge mismatching component descriptors:\n${JSON.stringify(e)}\nand\n${JSON.stringify(t)}`);
                                if (((e.uniqueId = t.uniqueId), "webassembly" === e.type || "auto" === e.type)) {
                                    const n = t;
                                    (e.parameterDefinitions = n.parameterDefinitions), (e.parameterValues = n.parameterValues);
                                }
                                if ("server" === e.type || "auto" === e.type) {
                                    const n = t;
                                    (e.sequence = n.sequence), (e.descriptor = n.descriptor);
                                }
                            })(r, i),
                            we(n) || fi(e, t));
                        break;
                    }
                    case Node.ELEMENT_NODE: {
                        const o =
                            (n = t) instanceof HTMLSelectElement
                                ? n.selectedIndex
                                : n instanceof HTMLInputElement
                                ? "checkbox" === n.type || "radio" === n.type
                                    ? n.checked
                                    : n.getAttribute("value") || ""
                                : n instanceof HTMLTextAreaElement
                                ? n.value
                                : null;
                        !(function (e, t) {
                            if (
                                !(function (e, t) {
                                    const n = e.length;
                                    if (n !== t.length) return !1;
                                    for (let o = 0; o < n; o++) {
                                        const n = t.item(o),
                                            r = e.item(o);
                                        if (n.name !== r.name || n.value !== r.value) return !1;
                                    }
                                    return !0;
                                })(e.attributes, t.attributes)
                            ) {
                                const r = new Map();
                                for (const t of e.attributes) r.set(t.name, t);
                                for (const n of t.attributes) {
                                    const t = n.namespaceURI ? e.getAttributeNodeNS(n.namespaceURI, n.localName) : e.getAttributeNode(n.name);
                                    t ? (t.value !== n.value && ai(e, n), r.delete(t.name)) : ai(e, n);
                                }
                                for (const t of r.values()) (n = e), (o = t).namespaceURI ? n.removeAttributeNS(o.namespaceURI, o.localName) : n.removeAttribute(o.name);
                            }
                            var n, o;
                        })(e, t),
                            ae(e),
                            (function (e) {
                                return e.hasAttribute(ci);
                            })(e) || fi(e, t),
                            null !== o &&
                                (function (e, t) {
                                    e instanceof HTMLTextAreaElement && e.value !== t
                                        ? (e.value = t)
                                        : e instanceof HTMLSelectElement && e.selectedIndex !== t
                                        ? (e.selectedIndex = t)
                                        : e instanceof HTMLInputElement && ("checkbox" === e.type || "radio" === e.type ? e.checked !== t && (e.checked = t) : e.value !== t && (e.value = t));
                                })(e, o);
                        break;
                    }
                    case Node.DOCUMENT_TYPE_NODE:
                        break;
                    default:
                        throw new Error(`Not implemented: matching nodes of type ${e.nodeType}`);
                }
                var n;
            }
            function mi(e, t) {
                switch (e.nodeType) {
                    case Node.TEXT_NODE:
                    case Node.COMMENT_NODE:
                        e.textContent = t.textContent;
                        break;
                    default:
                        throw new Error(`Not implemented: substituting nodes of type ${e.nodeType}`);
                }
            }
            function vi(e, t, n) {
                Z(n)
                    ? (function (e, t, n) {
                          const o = Y(t);
                          let r;
                          if (n) {
                              if (((r = Array.prototype.indexOf.call(o, n)), r < 0)) throw new Error("Could not find logical element in the parent logical node list");
                          } else r = o.length;
                          q(e, t, r);
                      })(e, n, t)
                    : n.insertBefore(e, t);
                const o = document.createNodeIterator(e, NodeFilter.SHOW_COMMENT);
                for (; o.nextNode(); ) {
                    const e = X(o.referenceNode);
                    e && (null == ui || ui.registerComponent(e));
                }
            }
            function yi(e, t) {
                if (e.nodeType !== t.nodeType) return li.Infinite;
                if (Z(e) !== Z(t)) return li.Infinite;
                switch (e.nodeType) {
                    case Node.TEXT_NODE:
                        return e.textContent === t.textContent ? li.None : li.Some;
                    case Node.COMMENT_NODE: {
                        const n = X(e),
                            o = X(t);
                        return n || o ? (n && o && Ut(n, o) ? li.None : li.Infinite) : e.textContent === t.textContent ? li.None : li.Some;
                    }
                    case Node.ELEMENT_NODE:
                        return e.tagName !== t.tagName ? li.Infinite : ((n = t), e.getAttribute(ci) !== n.getAttribute(ci) ? li.Infinite : li.None);
                    case Node.DOCUMENT_TYPE_NODE:
                        return li.None;
                    default:
                        return li.Infinite;
                }
                var n;
            }
            function wi(e) {
                const t = bt(e, "server"),
                    n = bt(e, "webassembly"),
                    o = bt(e, "auto"),
                    r = [];
                for (const e of [...t, ...n, ...o]) {
                    const t = X(e.start);
                    if (t) r.push(t);
                    else {
                        H(e);
                        const { start: t, end: n } = e;
                        (t.textContent = "bl-root"), n && (n.textContent = "/bl-root"), r.push(e);
                    }
                }
                return r;
            }
            class bi {
                constructor(e) {
                    this.current = e;
                }
                advance() {
                    if (!this.current) throw new Error("Cannot advance beyond the end of the sibling array");
                    this.current = this.current.nextSibling;
                }
            }
            class _i {
                constructor(e) {
                    this.current = e;
                }
                advance() {
                    if (!this.current) throw new Error("Cannot advance beyond the end of the logical children array");
                    const e = Q(this.current);
                    this.current = e;
                }
            }
            class Si {
                item(e) {
                    return this.siblings.item(this.startIndex + e);
                }
                forEach(e, t) {
                    for (let n = 0; n < this.length; n++) e.call(t, this.item(n), n, this);
                }
                constructor(e, t) {
                    (this.siblings = e),
                        (this.startIndex = Array.prototype.indexOf.call(this.siblings, t.startExclusive) + 1),
                        (this.endIndexExcl = Array.prototype.indexOf.call(this.siblings, t.endExclusive)),
                        (this.length = this.endIndexExcl - this.startIndex);
                }
            }
            class Ci {
                constructor(e) {
                    const t = Y(e);
                    (this.length = t.length), Object.assign(this, t);
                }
                item(e) {
                    return this[e] || null;
                }
                forEach(e, t) {
                    for (let n = 0; n < this.length; n++) e.call(t, this.item(n), n, this);
                }
            }
            const Ei = "text/html; blazor-enhanced-nav=on";
            let Ii,
                ki,
                Ti,
                Ri = location.href;
            function Ai(e) {
                (ki = e), document.addEventListener("click", xi), document.addEventListener("submit", Mi), window.addEventListener("popstate", Ni), (Ie = Di);
            }
            function Di(e, t) {
                t ? history.replaceState(null, "", e) : history.pushState(null, "", e), Pi(e, !1);
            }
            function xi(e) {
                Be() ||
                    (e.target instanceof Element &&
                        !(function (e) {
                            const t = e.closest("[data-enhance-nav]");
                            if (t) {
                                const e = t.getAttribute("data-enhance-nav");
                                return "" === e || "true" === e.toLowerCase();
                            }
                            return !0;
                        })(e.target)) ||
                    Ne(e, (e) => {
                        history.pushState(null, "", e), Pi(e, !0);
                    });
            }
            function Ni(e) {
                Be() || Pi(location.href, !1);
            }
            function Mi(e) {
                var t, n, o, r, i;
                if (Be() || e.defaultPrevented) return;
                const s = e.target;
                if (s instanceof HTMLFormElement) {
                    if (
                        !(function (e) {
                            const t = e.getAttribute("data-enhance");
                            return ("string" == typeof t && "" === t) || "true" === (null == t ? void 0 : t.toLowerCase());
                        })(s)
                    )
                        return;
                    const a = (null === (t = e.submitter) || void 0 === t ? void 0 : t.getAttribute("formmethod")) || s.method;
                    if ("dialog" === a) return void console.warn('A form cannot be enhanced when its method is "dialog".');
                    const c = (null === (n = e.submitter) || void 0 === n ? void 0 : n.getAttribute("formtarget")) || s.target;
                    if ("" !== c && "_self" !== c) return void console.warn('A form cannot be enhanced when its target is different from the default value "_self".');
                    e.preventDefault();
                    const l = new URL((null === (o = e.submitter) || void 0 === o ? void 0 : o.getAttribute("formaction")) || s.action, document.baseURI),
                        h = { method: a },
                        d = new FormData(s),
                        u = null === (r = e.submitter) || void 0 === r ? void 0 : r.getAttribute("name"),
                        p = e.submitter.getAttribute("value");
                    u && p && d.append(u, p);
                    const f = new URLSearchParams(d).toString();
                    if ("get" === h.method) (l.search = f), history.pushState(null, "", l.toString());
                    else {
                        const t = (null === (i = e.submitter) || void 0 === i ? void 0 : i.getAttribute("formenctype")) || s.enctype;
                        "multipart/form-data" === t ? (h.body = d) : ((h.body = f), (h.headers = { "content-type": t, accept: Ei }));
                    }
                    Pi(l.toString(), !1, h);
                }
            }
            async function Pi(e, t, n) {
                (Ti = !0),
                    null == Ii || Ii.abort(),
                    (function (e, t) {
                        null == ke || ke(e, t);
                    })(e, t),
                    (Ii = new AbortController());
                const o = Ii.signal,
                    r = fetch(e, Object.assign({ signal: o, mode: "no-cors", headers: { accept: Ei } }, n));
                let i = null;
                if (
                    (await (async function (e, t, n, o) {
                        let r;
                        try {
                            if (((r = await e), !r.body)) return void n(r, "");
                            const t = r.headers.get("ssr-framing");
                            if (!t) {
                                const e = await r.text();
                                return void n(r, e);
                            }
                            let o = !0;
                            await r.body
                                .pipeThrough(new TextDecoderStream())
                                .pipeThrough(
                                    (function (e) {
                                        let t = "";
                                        return new TransformStream({
                                            transform(n, o) {
                                                if (((t += n), t.indexOf(e, t.length - n.length - e.length) >= 0)) {
                                                    const n = t.split(e);
                                                    n.slice(0, -1).forEach((e) => o.enqueue(e)), (t = n[n.length - 1]);
                                                }
                                            },
                                            flush(e) {
                                                e.enqueue(t);
                                            },
                                        });
                                    })(`\x3c!--${t}--\x3e`)
                                )
                                .pipeTo(
                                    new WritableStream({
                                        write(e) {
                                            o
                                                ? ((o = !1), n(r, e))
                                                : ((e) => {
                                                      const t = document.createRange().createContextualFragment(e);
                                                      for (; t.firstChild; ) document.body.appendChild(t.firstChild);
                                                  })(e);
                                        },
                                    })
                                );
                        } catch (e) {
                            if ("AbortError" === e.name && t.aborted) return;
                            throw e;
                        }
                    })(r, o, (t, o) => {
                        const r = !(null == n ? void 0 : n.method) || "get" === n.method,
                            s = t.status >= 200 && t.status < 300;
                        if ("opaque" === t.type) {
                            if (r) return void Li(e);
                            throw new Error(
                                "Enhanced navigation does not support making a non-GET request to an endpoint that redirects to an external origin. Avoid enabling enhanced navigation for form posts that may perform external redirections."
                            );
                        }
                        if (s && "allow" !== t.headers.get("blazor-enhanced-nav")) {
                            if (r) return void Li(e);
                            throw new Error("Enhanced navigation does not support making a non-GET request to a non-Blazor endpoint. Avoid enabling enhanced navigation for forms that post to a non-Blazor endpoint.");
                        }
                        t.redirected && (r ? history.replaceState(null, "", t.url) : t.url !== location.href && history.pushState(null, "", t.url), (e = t.url));
                        const a = t.headers.get("blazor-enhanced-nav-redirect-location");
                        if (a) return void location.replace(a);
                        t.redirected ||
                            r ||
                            !s ||
                            ((function (e) {
                                const t = new URL(e.url),
                                    n = new URL(Ri);
                                return t.protocol === n.protocol && t.host === n.host && t.port === n.port && t.pathname === n.pathname;
                            })(t)
                                ? location.href !== Ri && history.pushState(null, "", Ri)
                                : (i = `Cannot perform enhanced form submission that changes the URL (except via a redirection), because then back/forward would not work. Either remove this form's 'action' attribute, or change its method to 'get', or do not mark it as enhanced.\nOld URL: ${location.href}\nNew URL: ${t.url}`)),
                            (Ri = t.url);
                        const c = t.headers.get("content-type");
                        if ((null == c ? void 0 : c.startsWith("text/html")) && o) {
                            const e = new DOMParser().parseFromString(o, "text/html");
                            pi(document, e), ki.documentUpdated();
                        } else
                            (null == c ? void 0 : c.startsWith("text/")) && o
                                ? Ui(o)
                                : s || o
                                ? r
                                    ? Li(e)
                                    : Ui(`Error: ${n.method} request to ${e} returned non-HTML content of type ${c || "unspecified"}.`)
                                : Ui(`Error: ${t.status} ${t.statusText}`);
                    }),
                    !o.aborted)
                ) {
                    const t = e.indexOf("#");
                    if (t >= 0) {
                        const n = e.substring(t + 1),
                            o = document.getElementById(n);
                        null == o || o.scrollIntoView();
                    }
                    if (((Ti = !1), ki.enhancedNavigationCompleted(), i)) throw new Error(i);
                }
            }
            function Ui(e) {
                document.documentElement.textContent = e;
                const t = document.documentElement.style;
                (t.fontFamily = "consolas, monospace"), (t.whiteSpace = "pre-wrap"), (t.padding = "1rem");
            }
            function Li(e) {
                history.replaceState(null, "", e + "?"), location.replace(e);
            }
            let Bi,
                Oi = !0;
            class Fi extends HTMLElement {
                connectedCallback() {
                    var e;
                    const t = this.parentNode;
                    null === (e = t.parentNode) || void 0 === e || e.removeChild(t),
                        t.childNodes.forEach((e) => {
                            if (e instanceof HTMLTemplateElement) {
                                const t = e.getAttribute("blazor-component-id");
                                if (t)
                                    ("true" !== e.getAttribute("enhanced-nav") && Ii) ||
                                        (function (e, t) {
                                            const n = (function (e) {
                                                const t = `bl:${e}`,
                                                    n = document.createNodeIterator(document, NodeFilter.SHOW_COMMENT);
                                                let o = null;
                                                for (; (o = n.nextNode()) && o.textContent !== t; );
                                                if (!o) return null;
                                                const r = `/bl:${e}`;
                                                let i = null;
                                                for (; (i = n.nextNode()) && i.textContent !== r; );
                                                return i ? { startMarker: o, endMarker: i } : null;
                                            })(e);
                                            if (n) {
                                                const { startMarker: e, endMarker: o } = n;
                                                if (Oi) pi({ startExclusive: e, endExclusive: o }, t);
                                                else {
                                                    const n = o.parentNode,
                                                        r = new Range();
                                                    for (r.setStart(e, e.textContent.length), r.setEnd(o, 0), r.deleteContents(); t.childNodes[0]; ) n.insertBefore(t.childNodes[0], o);
                                                }
                                                Bi.documentUpdated();
                                            }
                                        })(t, e.content);
                                else
                                    switch (e.getAttribute("type")) {
                                        case "redirection":
                                            const t = Le(e.content.textContent),
                                                n = "form-post" === e.getAttribute("from");
                                            "true" === e.getAttribute("enhanced") && Me(t) ? (n ? history.pushState(null, "", t) : history.replaceState(null, "", t), Pi(t, !1)) : n ? location.assign(t) : location.replace(t);
                                            break;
                                        case "error":
                                            Ui(e.content.textContent || "Error");
                                    }
                            }
                        });
                }
            }
            class $i {
                constructor(e) {
                    var t;
                    (this._circuitInactivityTimeoutMs = e),
                        (this._rootComponentsBySsrComponentId = new Map()),
                        (this._seenDescriptors = new Set()),
                        (this._pendingOperationBatches = {}),
                        (this._nextOperationBatchId = 1),
                        (this._nextSsrComponentId = 1),
                        (this._didWebAssemblyFailToLoadQuickly = !1),
                        (this._isComponentRefreshPending = !1),
                        (this.initialComponents = []),
                        (t = () => {
                            this.rootComponentsMayRequireRefresh();
                        }),
                        E.push(t);
                }
                onAfterRenderBatch(e) {
                    e === Ln.Server && this.circuitMayHaveNoRootComponents();
                }
                onDocumentUpdated() {
                    this.rootComponentsMayRequireRefresh();
                }
                onEnhancedNavigationCompleted() {
                    this.rootComponentsMayRequireRefresh();
                }
                registerComponent(e) {
                    if (this._seenDescriptors.has(e)) return;
                    ("auto" !== e.type && "webassembly" !== e.type) || this.startLoadingWebAssemblyIfNotStarted();
                    const t = this._nextSsrComponentId++;
                    this._seenDescriptors.add(e), this._rootComponentsBySsrComponentId.set(t, { descriptor: e, ssrComponentId: t });
                }
                unregisterComponent(e) {
                    this._seenDescriptors.delete(e.descriptor), this._rootComponentsBySsrComponentId.delete(e.ssrComponentId), this.circuitMayHaveNoRootComponents();
                }
                async startLoadingWebAssemblyIfNotStarted() {
                    if (void 0 !== Hr) return;
                    Kr = !0;
                    const e = ei();
                    setTimeout(() => {
                        ti() || this.onWebAssemblyFailedToLoadQuickly();
                    }, mt._internal.loadWebAssemblyQuicklyTimeout);
                    const t = await Vr;
                    (function (e) {
                        if (!e.cacheBootResources) return !1;
                        const t = Hi(e);
                        if (!t) return !1;
                        const n = window.localStorage.getItem(t.key);
                        return t.value === n;
                    })(t) || this.onWebAssemblyFailedToLoadQuickly(),
                        await e,
                        (function (e) {
                            const t = Hi(e);
                            t && window.localStorage.setItem(t.key, t.value);
                        })(t),
                        this.rootComponentsMayRequireRefresh();
                }
                onWebAssemblyFailedToLoadQuickly() {
                    this._didWebAssemblyFailToLoadQuickly || ((this._didWebAssemblyFailToLoadQuickly = !0), this.rootComponentsMayRequireRefresh());
                }
                startCircutIfNotStarted() {
                    return void 0 === Go ? er(this) : !Ko || Ko.isDisposedOrDisposing() ? nr() : void 0;
                }
                async startWebAssemblyIfNotStarted() {
                    this.startLoadingWebAssemblyIfNotStarted(), void 0 === Wr && (await Qr(this));
                }
                rootComponentsMayRequireRefresh() {
                    this._isComponentRefreshPending ||
                        ((this._isComponentRefreshPending = !0),
                        setTimeout(() => {
                            (this._isComponentRefreshPending = !1), this.refreshRootComponents(this._rootComponentsBySsrComponentId.values());
                        }, 0));
                }
                circuitMayHaveNoRootComponents() {
                    if (this.rendererHasExistingOrPendingComponents(Ln.Server, "server", "auto")) return clearTimeout(this._circuitInactivityTimeoutId), void (this._circuitInactivityTimeoutId = void 0);
                    void 0 === this._circuitInactivityTimeoutId &&
                        (this._circuitInactivityTimeoutId = setTimeout(() => {
                            this.rendererHasExistingOrPendingComponents(Ln.Server, "server", "auto") ||
                                ((async function () {
                                    await (null == Ko ? void 0 : Ko.dispose());
                                })(),
                                (this._circuitInactivityTimeoutId = void 0));
                        }, this._circuitInactivityTimeoutMs));
                }
                rendererHasComponents(e) {
                    const t = De(e);
                    return void 0 !== t && t.getRootComponentCount() > 0;
                }
                rendererHasExistingOrPendingComponents(e, ...t) {
                    if (this.rendererHasComponents(e)) return !0;
                    for (const {
                        descriptor: { type: n },
                        assignedRendererId: o,
                    } of this._rootComponentsBySsrComponentId.values()) {
                        if (o === e) return !0;
                        if (void 0 === o && -1 !== t.indexOf(n)) return !0;
                    }
                    return !1;
                }
                refreshRootComponents(e) {
                    const t = new Map();
                    for (const n of e) {
                        const e = this.determinePendingOperation(n);
                        if (!e) continue;
                        const o = n.assignedRendererId;
                        if (!o) throw new Error("Descriptors must be assigned a renderer ID before getting used as root components");
                        let r = t.get(o);
                        r || ((r = []), t.set(o, r)), r.push(e);
                    }
                    for (const [e, n] of t) {
                        const t = { batchId: this._nextOperationBatchId++, operations: n };
                        this._pendingOperationBatches[t.batchId] = t;
                        const o = JSON.stringify(t);
                        e === Ln.Server ? or(o) : this.updateWebAssemblyRootComponents(o);
                    }
                }
                updateWebAssemblyRootComponents(e) {
                    Jr
                        ? (Xr(e), (Jr = !1))
                        : (function (e) {
                              if (!Wr) throw new Error("Blazor WebAssembly has not started.");
                              if (!mt._internal.updateRootComponents) throw new Error("Blazor WebAssembly has not initialized.");
                              qr
                                  ? mt._internal.updateRootComponents(e)
                                  : (async function (e) {
                                        if ((await Wr, !mt._internal.updateRootComponents)) throw new Error("Blazor WebAssembly has not initialized.");
                                        mt._internal.updateRootComponents(e);
                                    })(e);
                          })(e);
                }
                resolveRendererIdForDescriptor(e) {
                    switch ("auto" === e.type ? this.getAutoRenderMode() : e.type) {
                        case "server":
                            return this.startCircutIfNotStarted(), Ln.Server;
                        case "webassembly":
                            return this.startWebAssemblyIfNotStarted(), Ln.WebAssembly;
                        case null:
                            return null;
                    }
                }
                getAutoRenderMode() {
                    return this.rendererHasExistingOrPendingComponents(Ln.WebAssembly, "webassembly")
                        ? "webassembly"
                        : this.rendererHasExistingOrPendingComponents(Ln.Server, "server")
                        ? "server"
                        : ti()
                        ? "webassembly"
                        : this._didWebAssemblyFailToLoadQuickly
                        ? "server"
                        : null;
                }
                determinePendingOperation(e) {
                    if (((t = e.descriptor), document.contains(t.start))) {
                        if (void 0 === e.assignedRendererId) {
                            if (Ti || "loading" === document.readyState) return null;
                            const t = this.resolveRendererIdForDescriptor(e.descriptor);
                            return null === t
                                ? null
                                : T(t)
                                ? (be(e.descriptor.start, !0), (e.assignedRendererId = t), (e.uniqueIdAtLastUpdate = e.descriptor.uniqueId), { type: "add", ssrComponentId: e.ssrComponentId, marker: Pt(e.descriptor) })
                                : null;
                        }
                        return T(e.assignedRendererId)
                            ? e.uniqueIdAtLastUpdate === e.descriptor.uniqueId
                                ? null
                                : ((e.uniqueIdAtLastUpdate = e.descriptor.uniqueId), { type: "update", ssrComponentId: e.ssrComponentId, marker: Pt(e.descriptor) })
                            : null;
                    }
                    return e.hasPendingRemoveOperation
                        ? null
                        : void 0 === e.assignedRendererId
                        ? (this.unregisterComponent(e), null)
                        : T(e.assignedRendererId)
                        ? (be(e.descriptor.start, !1), (e.hasPendingRemoveOperation = !0), { type: "remove", ssrComponentId: e.ssrComponentId })
                        : null;
                    var t;
                }
                resolveRootComponent(e) {
                    const t = this._rootComponentsBySsrComponentId.get(e);
                    if (!t) throw new Error(`Could not resolve a root component with SSR component ID '${e}'.`);
                    return t.descriptor;
                }
                onAfterUpdateRootComponents(e) {
                    const t = this._pendingOperationBatches[e];
                    delete this._pendingOperationBatches[e];
                    for (const e of t.operations)
                        switch (e.type) {
                            case "remove": {
                                const t = this._rootComponentsBySsrComponentId.get(e.ssrComponentId);
                                t && this.unregisterComponent(t);
                                break;
                            }
                        }
                }
            }
            function Hi(e) {
                var t;
                const n = null === (t = e.resources) || void 0 === t ? void 0 : t.hash,
                    o = e.mainAssemblyName;
                return n && o ? { key: `blazor-resource-hash:${o}`, value: n } : null;
            }
            class Wi {
                constructor() {
                    this._eventListeners = new Map();
                }
                static create(e) {
                    const t = new Wi();
                    return (e.addEventListener = t.addEventListener.bind(t)), (e.removeEventListener = t.removeEventListener.bind(t)), t;
                }
                addEventListener(e, t) {
                    let n = this._eventListeners.get(e);
                    n || ((n = new Set()), this._eventListeners.set(e, n)), n.add(t);
                }
                removeEventListener(e, t) {
                    var n;
                    null === (n = this._eventListeners.get(e)) || void 0 === n || n.delete(t);
                }
                dispatchEvent(e, t) {
                    const n = this._eventListeners.get(e);
                    if (!n) return;
                    const o = { ...t, type: e };
                    for (const e of n) e(o);
                }
            }
            let ji,
                zi = !1;
            function qi(e) {
                var t, n, o, r;
                if (zi) throw new Error("Blazor has already started.");
                (zi = !0),
                    (null !== (t = (e = e || {}).logLevel) && void 0 !== t) || (e.logLevel = vt.Error),
                    (mt._internal.loadWebAssemblyQuicklyTimeout = 3e3),
                    (mt._internal.hotReloadApplied = () => {
                        Pe() && Ue(location.href, !0);
                    }),
                    (ji = new $i(null !== (o = null === (n = null == e ? void 0 : e.ssr) || void 0 === n ? void 0 : n.circuitInactivityTimeoutMs) && void 0 !== o ? o : 2e3));
                const i = Wi.create(mt),
                    s = {
                        documentUpdated: () => {
                            ji.onDocumentUpdated(), i.dispatchEvent("enhancedload", {});
                        },
                        enhancedNavigationCompleted() {
                            ji.onEnhancedNavigationCompleted();
                        },
                    };
                return (
                    (ui = ji),
                    (function (e, t) {
                        (Bi = t), (null == e ? void 0 : e.disableDomPreservation) && (Oi = !1), customElements.define("blazor-ssr-end", Fi);
                    })(null == e ? void 0 : e.ssr, s),
                    (null === (r = null == e ? void 0 : e.ssr) || void 0 === r ? void 0 : r.disableDomPreservation) || Ai(s),
                    "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", Ji.bind(null, e)) : Ji(e),
                    Promise.resolve()
                );
            }
            function Ji(e) {
                const t = Oo((null == e ? void 0 : e.circuit) || {});
                e.circuit = t;
                const n = (async function (e, t) {
                    var n;
                    const o = It(document, Ct, "initializers");
                    if (!o) return new zo(!1, t);
                    const r = null !== (n = JSON.parse(atob(o))) && void 0 !== n ? n : [],
                        i = new zo(!1, t);
                    return await i.importInitializersAsync(r, [e]), i;
                })(e, new wt(t.logLevel));
                Zo(Ki(n, t)),
                    (function (e) {
                        if (Fr) throw new Error("WebAssembly options have already been configured.");
                        !(async function (e) {
                            const t = await e;
                            (Fr = t), Yr();
                        })(e);
                    })(Ki(n, (null == e ? void 0 : e.webAssembly) || {})),
                    // (function (e) {
                    //     const t = wi(document);
                    //     for (const e of t) null == ui || ui.registerComponent(e);
                    // })(),
                    // ji.onDocumentUpdated(),
                    (async function (e) {
                        const t = await e;
                        await t.invokeAfterStartedCallbacks(mt);
                    })(n);
            }
            async function Ki(e, t) {
                return await e, t;
            }
            (mt.start = qi), (mt.startIslands = () => {
                const t = wi(document);
                for (const e of t) null == ui || ui.registerComponent(e);
                ji.onDocumentUpdated();
            }),
             (window.DotNet = e), document && document.currentScript && "false" !== document.currentScript.getAttribute("autostart") && qi();
        })();
})();
