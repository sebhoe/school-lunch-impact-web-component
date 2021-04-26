var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    function attribute_to_object(attributes) {
        const result = {};
        for (const attribute of attributes) {
            result[attribute.name] = attribute.value;
        }
        return result;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set($$props) {
                if (this.$$set && !is_empty($$props)) {
                    this.$$.skip_bound = true;
                    this.$$set($$props);
                    this.$$.skip_bound = false;
                }
            }
        };
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* lib/MyComponent.wc.svelte generated by Svelte v3.32.0 */

    const file = "lib/MyComponent.wc.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let ol;
    	let li0;
    	let h20;
    	let t2;
    	let strong0;
    	let t4;
    	let t5;
    	let p0;
    	let input0;
    	let t6;
    	let input1;
    	let t7;
    	let li1;
    	let h21;
    	let t8;
    	let strong1;
    	let t10;
    	let t11;
    	let div3;
    	let div0;
    	let p1;
    	let t13;
    	let label0;
    	let input2;
    	let t14;
    	let t15;
    	let small0;
    	let t17;
    	let div1;
    	let p2;
    	let t19;
    	let label1;
    	let input3;
    	let t20;
    	let t21;
    	let small1;
    	let t23;
    	let div2;
    	let p3;
    	let t25;
    	let label2;
    	let input4;
    	let t26;
    	let t27;
    	let small2;
    	let t29;
    	let li2;
    	let h22;
    	let t30;
    	let strong2;
    	let t32;
    	let strong3;
    	let t34;
    	let t35;
    	let p4;
    	let label3;
    	let input5;
    	let t36;
    	let t37;
    	let section0;
    	let h23;
    	let t38;
    	let strong4;
    	let t39_value = (/*meatToPlant*/ ctx[1] + /*meatToVeg*/ ctx[2] + /*vegToPlant*/ ctx[3]) * /*dishesPerDay*/ ctx[4] * /*daysPerWeek*/ ctx[14] + "";
    	let t39;
    	let t40;
    	let t41;
    	let t42;
    	let section1;
    	let div6;
    	let div4;
    	let p5;
    	let strong5;
    	let t44;
    	let br0;
    	let t45;
    	let t46;
    	let div5;
    	let img0;
    	let img0_src_value;
    	let t47;
    	let div11;
    	let div7;
    	let img1;
    	let img1_src_value;
    	let t48;
    	let div8;
    	let p6;
    	let strong6;
    	let t49_value = /*sumCarbon*/ ctx[5].toLocaleString(undefined, { maximumFractionDigits: 3 }) + "";
    	let t49;
    	let t50;
    	let span0;
    	let t51;
    	let sub;
    	let t53;
    	let t54;
    	let br1;
    	let t55;
    	let strong7;
    	let t56_value = (/*sumCarbon*/ ctx[5] / /*CARBON_PER_KM*/ ctx[8]).toLocaleString() + "";
    	let t56;
    	let t57;
    	let span1;
    	let t59;
    	let div9;
    	let img2;
    	let img2_src_value;
    	let t60;
    	let div10;
    	let t62;
    	let div16;
    	let div12;
    	let img3;
    	let img3_src_value;
    	let t63;
    	let div13;
    	let p7;
    	let strong8;
    	let t64_value = /*sumWater*/ ctx[6].toLocaleString() + "";
    	let t64;
    	let t65;
    	let span2;
    	let t67;
    	let br2;
    	let t68;
    	let strong9;
    	let t69_value = (/*sumWater*/ ctx[6] / /*LITER_PER_BATHTUB*/ ctx[9]).toLocaleString(undefined, { maximumFractionDigits: 0 }) + "";
    	let t69;
    	let t70;
    	let span3;
    	let t72;
    	let div14;
    	let img4;
    	let img4_src_value;
    	let t73;
    	let div15;
    	let t75;
    	let div21;
    	let div17;
    	let img5;
    	let img5_src_value;
    	let t76;
    	let div18;
    	let p8;
    	let strong10;
    	let t77_value = /*sumLand*/ ctx[7].toLocaleString(undefined, { maximumFractionDigits: 0 }) + "";
    	let t77;
    	let t78;
    	let span4;
    	let t79;
    	let sup;
    	let t81;
    	let t82;
    	let br3;
    	let t83;
    	let strong11;
    	let t84_value = (/*sumLand*/ ctx[7] / /*SQUARE_METER_PER_PITCH*/ ctx[10]).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "";
    	let t84;
    	let t85;
    	let span5;
    	let t87;
    	let div19;
    	let img6;
    	let img6_src_value;
    	let t88;
    	let div20;
    	let t90;
    	let section2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Schulverpflegung Impact Rechner";
    			t1 = space();
    			ol = element("ol");
    			li0 = element("li");
    			h20 = element("h2");
    			t2 = text("Wie viele ");
    			strong0 = element("strong");
    			strong0.textContent = "Menülinien";
    			t4 = text(" bieten Sie an?");
    			t5 = space();
    			p0 = element("p");
    			input0 = element("input");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			li1 = element("li");
    			h21 = element("h2");
    			t8 = text("Wie viele ");
    			strong1 = element("strong");
    			strong1.textContent = "Gerichte";
    			t10 = text(" in Ihren Menülinien möchten Sie klima-\n        und umweltfreundlicher gestalten (pro Woche)?");
    			t11 = space();
    			div3 = element("div");
    			div0 = element("div");
    			p1 = element("p");
    			p1.textContent = "🍖 🔜 🧀";
    			t13 = space();
    			label0 = element("label");
    			input2 = element("input");
    			t14 = text("\n            Gerichte");
    			t15 = space();
    			small0 = element("small");
    			small0.textContent = "vegetarisch statt fleischhaltig";
    			t17 = space();
    			div1 = element("div");
    			p2 = element("p");
    			p2.textContent = "🍖 🔜 🌱";
    			t19 = space();
    			label1 = element("label");
    			input3 = element("input");
    			t20 = text("\n            Gerichte");
    			t21 = space();
    			small1 = element("small");
    			small1.textContent = "rein pflanzlich statt fleischhaltig";
    			t23 = space();
    			div2 = element("div");
    			p3 = element("p");
    			p3.textContent = "🧀 🔜 🌱";
    			t25 = space();
    			label2 = element("label");
    			input4 = element("input");
    			t26 = text("\n            Gerichte");
    			t27 = space();
    			small2 = element("small");
    			small2.textContent = "rein pflanzlich statt vegetarisch";
    			t29 = space();
    			li2 = element("li");
    			h22 = element("h2");
    			t30 = text("Wie viele ");
    			strong2 = element("strong");
    			strong2.textContent = "Portionen";
    			t32 = text(" bereiten Sie bei regulärem\n        Schulbetrieb ");
    			strong3 = element("strong");
    			strong3.textContent = "pro Tag";
    			t34 = text(" zu?");
    			t35 = space();
    			p4 = element("p");
    			label3 = element("label");
    			input5 = element("input");
    			t36 = text("\n          Portionen");
    			t37 = space();
    			section0 = element("section");
    			h23 = element("h2");
    			t38 = text("Durch den Einsatz von\n      ");
    			strong4 = element("strong");
    			t39 = text(t39_value);
    			t40 = text("\n        klima- und umweltfreundlicheren Mahlzeiten");
    			t41 = text("\n      pro Woche sparen sie im Jahr etwa");
    			t42 = space();
    			section1 = element("section");
    			div6 = element("div");
    			div4 = element("div");
    			p5 = element("p");
    			strong5 = element("strong");
    			strong5.textContent = "Wir sparen pro Jahr";
    			t44 = space();
    			br0 = element("br");
    			t45 = text("\n          durch die Reduktion von tierischen Lebensmitteln in der Schulverpflegung\n          bis zu...");
    			t46 = space();
    			div5 = element("div");
    			img0 = element("img");
    			t47 = space();
    			div11 = element("div");
    			div7 = element("div");
    			img1 = element("img");
    			t48 = space();
    			div8 = element("div");
    			p6 = element("p");
    			strong6 = element("strong");
    			t49 = text(t49_value);
    			t50 = space();
    			span0 = element("span");
    			t51 = text("Tonnen CO");
    			sub = element("sub");
    			sub.textContent = "2";
    			t53 = text("-Equivalente,");
    			t54 = space();
    			br1 = element("br");
    			t55 = text("das entspricht\n          ");
    			strong7 = element("strong");
    			t56 = text(t56_value);
    			t57 = space();
    			span1 = element("span");
    			span1.textContent = "km mit dem Auto";
    			t59 = space();
    			div9 = element("div");
    			img2 = element("img");
    			t60 = space();
    			div10 = element("div");
    			div10.textContent = "berechnet auf proveg.com/de/impact-rechner";
    			t62 = space();
    			div16 = element("div");
    			div12 = element("div");
    			img3 = element("img");
    			t63 = space();
    			div13 = element("div");
    			p7 = element("p");
    			strong8 = element("strong");
    			t64 = text(t64_value);
    			t65 = space();
    			span2 = element("span");
    			span2.textContent = "Liter Wasser,";
    			t67 = space();
    			br2 = element("br");
    			t68 = text("das entspricht\n          ");
    			strong9 = element("strong");
    			t69 = text(t69_value);
    			t70 = space();
    			span3 = element("span");
    			span3.textContent = "Badewannen";
    			t72 = space();
    			div14 = element("div");
    			img4 = element("img");
    			t73 = space();
    			div15 = element("div");
    			div15.textContent = "berechnet auf proveg.com/de/impact-rechner";
    			t75 = space();
    			div21 = element("div");
    			div17 = element("div");
    			img5 = element("img");
    			t76 = space();
    			div18 = element("div");
    			p8 = element("p");
    			strong10 = element("strong");
    			t77 = text(t77_value);
    			t78 = space();
    			span4 = element("span");
    			t79 = text("m");
    			sup = element("sup");
    			sup.textContent = "2";
    			t81 = text(" Land,");
    			t82 = space();
    			br3 = element("br");
    			t83 = text("das entspricht\n          ");
    			strong11 = element("strong");
    			t84 = text(t84_value);
    			t85 = space();
    			span5 = element("span");
    			span5.textContent = "Fußballfeldern";
    			t87 = space();
    			div19 = element("div");
    			img6 = element("img");
    			t88 = space();
    			div20 = element("div");
    			div20.textContent = "berechnet auf proveg.com/de/impact-rechner";
    			t90 = space();
    			section2 = element("section");
    			this.c = noop;
    			add_location(h1, file, 73, 2, 2197);
    			add_location(strong0, file, 78, 18, 2284);
    			add_location(h20, file, 77, 6, 2261);
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", /*minMenuLines*/ ctx[11]);
    			attr_dev(input0, "max", /*maxMenuLines*/ ctx[12]);
    			add_location(input0, file, 81, 8, 2378);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", /*minMenuLines*/ ctx[11]);
    			attr_dev(input1, "max", /*maxMenuLines*/ ctx[12]);
    			add_location(input1, file, 87, 8, 2518);
    			attr_dev(p0, "class", "flex-wrapper");
    			add_location(p0, file, 80, 6, 2345);
    			add_location(li0, file, 76, 4, 2250);
    			add_location(strong1, file, 98, 18, 2711);
    			add_location(h21, file, 97, 6, 2688);
    			attr_dev(p1, "class", "large-icons");
    			add_location(p1, file, 103, 10, 2965);
    			attr_dev(input2, "name", "KCAL_meat_to_plant");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "max", "100");
    			add_location(input2, file, 105, 12, 3046);
    			attr_dev(label0, "class", "inline");
    			add_location(label0, file, 104, 10, 3011);
    			add_location(small0, file, 114, 10, 3271);
    			attr_dev(div0, "class", "flex-wrapper flex-wrapper--col");
    			add_location(div0, file, 102, 8, 2910);
    			attr_dev(p2, "class", "large-icons");
    			add_location(p2, file, 118, 10, 3397);
    			attr_dev(input3, "name", "KCAL_meat_to_veg");
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "min", "0");
    			attr_dev(input3, "max", "100");
    			add_location(input3, file, 120, 12, 3478);
    			attr_dev(label1, "class", "inline");
    			add_location(label1, file, 119, 10, 3443);
    			add_location(small1, file, 129, 10, 3699);
    			attr_dev(div1, "class", "flex-wrapper flex-wrapper--col");
    			add_location(div1, file, 117, 8, 3342);
    			attr_dev(p3, "class", "large-icons");
    			add_location(p3, file, 133, 10, 3829);
    			attr_dev(input4, "name", "KCAL_veg_to_plant");
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "min", "0");
    			attr_dev(input4, "max", "100");
    			add_location(input4, file, 135, 12, 3910);
    			attr_dev(label2, "class", "inline");
    			add_location(label2, file, 134, 10, 3875);
    			add_location(small2, file, 144, 10, 4133);
    			attr_dev(div2, "class", "flex-wrapper flex-wrapper--col");
    			add_location(div2, file, 132, 8, 3774);
    			attr_dev(div3, "class", "flex-wrapper flex-wrapper--space-around");
    			add_location(div3, file, 101, 6, 2848);
    			add_location(li1, file, 96, 4, 2677);
    			add_location(strong2, file, 151, 18, 4259);
    			add_location(strong3, file, 152, 21, 4334);
    			add_location(h22, file, 150, 6, 4236);
    			attr_dev(input5, "type", "number");
    			attr_dev(input5, "min", "0");
    			attr_dev(input5, "max", /*maxDishesPerDay*/ ctx[13]);
    			add_location(input5, file, 156, 10, 4447);
    			attr_dev(label3, "class", "inline");
    			add_location(label3, file, 155, 8, 4414);
    			attr_dev(p4, "class", "flex-wrapper");
    			add_location(p4, file, 154, 6, 4381);
    			add_location(li2, file, 149, 4, 4225);
    			add_location(ol, file, 75, 2, 2241);
    			add_location(strong4, file, 179, 6, 4942);
    			add_location(h23, file, 177, 4, 4903);
    			add_location(section0, file, 176, 2, 4889);
    			attr_dev(strong5, "class", "text text--large");
    			add_location(strong5, file, 191, 10, 5231);
    			add_location(br0, file, 192, 10, 5303);
    			add_location(p5, file, 190, 8, 5217);
    			add_location(div4, file, 189, 6, 5203);
    			if (img0.src !== (img0_src_value = "./img/proveg-logo.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "proveg logo");
    			add_location(img0, file, 198, 8, 5472);
    			attr_dev(div5, "class", "logo");
    			add_location(div5, file, 197, 6, 5445);
    			attr_dev(div6, "class", "banner");
    			add_location(div6, file, 188, 4, 5176);
    			if (img1.src !== (img1_src_value = "./img/icons/carbon.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "carbon icon");
    			add_location(img1, file, 203, 8, 5608);
    			attr_dev(div7, "class", "icon");
    			add_location(div7, file, 202, 6, 5581);
    			attr_dev(strong6, "class", "text text--orange text--large");
    			add_location(strong6, file, 207, 10, 5710);
    			add_location(sub, file, 213, 21, 5948);
    			attr_dev(span0, "class", "text text--orange");
    			add_location(span0, file, 212, 10, 5894);
    			add_location(br1, file, 215, 10, 6002);
    			attr_dev(strong7, "class", "text text--orange text--large");
    			add_location(strong7, file, 216, 10, 6033);
    			attr_dev(span1, "class", "text text--orange");
    			add_location(span1, file, 219, 10, 6169);
    			add_location(p6, file, 206, 8, 5696);
    			add_location(div8, file, 205, 6, 5682);
    			if (img2.src !== (img2_src_value = "./img/proveg-logo.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "proveg logo");
    			add_location(img2, file, 223, 8, 6283);
    			attr_dev(div9, "class", "logo");
    			add_location(div9, file, 222, 6, 6256);
    			attr_dev(div10, "class", "link");
    			add_location(div10, file, 225, 6, 6356);
    			attr_dev(div11, "class", "banner");
    			add_location(div11, file, 201, 4, 5554);
    			if (img3.src !== (img3_src_value = "./img/icons/waterdrop.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "waterdrop icon");
    			add_location(img3, file, 229, 8, 6492);
    			attr_dev(div12, "class", "icon");
    			add_location(div12, file, 228, 6, 6465);
    			attr_dev(strong8, "class", "text text--blue text--large");
    			add_location(strong8, file, 233, 10, 6600);
    			attr_dev(span2, "class", "text text--blue");
    			add_location(span2, file, 236, 10, 6715);
    			add_location(br2, file, 237, 10, 6776);
    			attr_dev(strong9, "class", "text text--blue text--large");
    			add_location(strong9, file, 238, 10, 6807);
    			attr_dev(span3, "class", "text text--blue");
    			add_location(span3, file, 243, 10, 7010);
    			add_location(p7, file, 232, 8, 6586);
    			add_location(div13, file, 231, 6, 6572);
    			if (img4.src !== (img4_src_value = "./img/proveg-logo.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "proveg logo");
    			add_location(img4, file, 247, 8, 7117);
    			attr_dev(div14, "class", "logo");
    			add_location(div14, file, 246, 6, 7090);
    			attr_dev(div15, "class", "link");
    			add_location(div15, file, 249, 6, 7190);
    			attr_dev(div16, "class", "banner");
    			add_location(div16, file, 227, 4, 6438);
    			if (img5.src !== (img5_src_value = "./img/icons/forrest.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "forrest icon");
    			add_location(img5, file, 253, 8, 7326);
    			attr_dev(div17, "class", "icon");
    			add_location(div17, file, 252, 6, 7299);
    			attr_dev(strong10, "class", "text text--green text--large");
    			add_location(strong10, file, 257, 10, 7430);
    			add_location(sup, file, 262, 42, 7643);
    			attr_dev(span4, "class", "text text--green");
    			add_location(span4, file, 262, 10, 7611);
    			add_location(br3, file, 263, 10, 7679);
    			attr_dev(strong11, "class", "text text--green text--large");
    			add_location(strong11, file, 264, 10, 7710);
    			attr_dev(span5, "class", "text text--green");
    			add_location(span5, file, 269, 10, 7918);
    			add_location(p8, file, 256, 8, 7416);
    			add_location(div18, file, 255, 6, 7402);
    			if (img6.src !== (img6_src_value = "./img/proveg-logo.svg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "proveg logo");
    			add_location(img6, file, 273, 8, 8030);
    			attr_dev(div19, "class", "logo");
    			add_location(div19, file, 272, 6, 8003);
    			attr_dev(div20, "class", "link");
    			add_location(div20, file, 275, 6, 8103);
    			attr_dev(div21, "class", "banner");
    			add_location(div21, file, 251, 4, 7272);
    			add_location(section1, file, 187, 2, 5162);
    			attr_dev(section2, "class", "spacer");
    			add_location(section2, file, 278, 2, 8196);
    			add_location(main, file, 72, 0, 2188);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, ol);
    			append_dev(ol, li0);
    			append_dev(li0, h20);
    			append_dev(h20, t2);
    			append_dev(h20, strong0);
    			append_dev(h20, t4);
    			append_dev(li0, t5);
    			append_dev(li0, p0);
    			append_dev(p0, input0);
    			set_input_value(input0, /*menuLines*/ ctx[0]);
    			append_dev(p0, t6);
    			append_dev(p0, input1);
    			set_input_value(input1, /*menuLines*/ ctx[0]);
    			append_dev(ol, t7);
    			append_dev(ol, li1);
    			append_dev(li1, h21);
    			append_dev(h21, t8);
    			append_dev(h21, strong1);
    			append_dev(h21, t10);
    			append_dev(li1, t11);
    			append_dev(li1, div3);
    			append_dev(div3, div0);
    			append_dev(div0, p1);
    			append_dev(div0, t13);
    			append_dev(div0, label0);
    			append_dev(label0, input2);
    			set_input_value(input2, /*meatToPlant*/ ctx[1]);
    			append_dev(label0, t14);
    			append_dev(div0, t15);
    			append_dev(div0, small0);
    			append_dev(div3, t17);
    			append_dev(div3, div1);
    			append_dev(div1, p2);
    			append_dev(div1, t19);
    			append_dev(div1, label1);
    			append_dev(label1, input3);
    			set_input_value(input3, /*meatToVeg*/ ctx[2]);
    			append_dev(label1, t20);
    			append_dev(div1, t21);
    			append_dev(div1, small1);
    			append_dev(div3, t23);
    			append_dev(div3, div2);
    			append_dev(div2, p3);
    			append_dev(div2, t25);
    			append_dev(div2, label2);
    			append_dev(label2, input4);
    			set_input_value(input4, /*vegToPlant*/ ctx[3]);
    			append_dev(label2, t26);
    			append_dev(div2, t27);
    			append_dev(div2, small2);
    			append_dev(ol, t29);
    			append_dev(ol, li2);
    			append_dev(li2, h22);
    			append_dev(h22, t30);
    			append_dev(h22, strong2);
    			append_dev(h22, t32);
    			append_dev(h22, strong3);
    			append_dev(h22, t34);
    			append_dev(li2, t35);
    			append_dev(li2, p4);
    			append_dev(p4, label3);
    			append_dev(label3, input5);
    			set_input_value(input5, /*dishesPerDay*/ ctx[4]);
    			append_dev(label3, t36);
    			append_dev(main, t37);
    			append_dev(main, section0);
    			append_dev(section0, h23);
    			append_dev(h23, t38);
    			append_dev(h23, strong4);
    			append_dev(strong4, t39);
    			append_dev(strong4, t40);
    			append_dev(h23, t41);
    			append_dev(main, t42);
    			append_dev(main, section1);
    			append_dev(section1, div6);
    			append_dev(div6, div4);
    			append_dev(div4, p5);
    			append_dev(p5, strong5);
    			append_dev(p5, t44);
    			append_dev(p5, br0);
    			append_dev(p5, t45);
    			append_dev(div6, t46);
    			append_dev(div6, div5);
    			append_dev(div5, img0);
    			append_dev(section1, t47);
    			append_dev(section1, div11);
    			append_dev(div11, div7);
    			append_dev(div7, img1);
    			append_dev(div11, t48);
    			append_dev(div11, div8);
    			append_dev(div8, p6);
    			append_dev(p6, strong6);
    			append_dev(strong6, t49);
    			append_dev(p6, t50);
    			append_dev(p6, span0);
    			append_dev(span0, t51);
    			append_dev(span0, sub);
    			append_dev(span0, t53);
    			append_dev(p6, t54);
    			append_dev(p6, br1);
    			append_dev(p6, t55);
    			append_dev(p6, strong7);
    			append_dev(strong7, t56);
    			append_dev(p6, t57);
    			append_dev(p6, span1);
    			append_dev(div11, t59);
    			append_dev(div11, div9);
    			append_dev(div9, img2);
    			append_dev(div11, t60);
    			append_dev(div11, div10);
    			append_dev(section1, t62);
    			append_dev(section1, div16);
    			append_dev(div16, div12);
    			append_dev(div12, img3);
    			append_dev(div16, t63);
    			append_dev(div16, div13);
    			append_dev(div13, p7);
    			append_dev(p7, strong8);
    			append_dev(strong8, t64);
    			append_dev(p7, t65);
    			append_dev(p7, span2);
    			append_dev(p7, t67);
    			append_dev(p7, br2);
    			append_dev(p7, t68);
    			append_dev(p7, strong9);
    			append_dev(strong9, t69);
    			append_dev(p7, t70);
    			append_dev(p7, span3);
    			append_dev(div16, t72);
    			append_dev(div16, div14);
    			append_dev(div14, img4);
    			append_dev(div16, t73);
    			append_dev(div16, div15);
    			append_dev(section1, t75);
    			append_dev(section1, div21);
    			append_dev(div21, div17);
    			append_dev(div17, img5);
    			append_dev(div21, t76);
    			append_dev(div21, div18);
    			append_dev(div18, p8);
    			append_dev(p8, strong10);
    			append_dev(strong10, t77);
    			append_dev(p8, t78);
    			append_dev(p8, span4);
    			append_dev(span4, t79);
    			append_dev(span4, sup);
    			append_dev(span4, t81);
    			append_dev(p8, t82);
    			append_dev(p8, br3);
    			append_dev(p8, t83);
    			append_dev(p8, strong11);
    			append_dev(strong11, t84);
    			append_dev(p8, t85);
    			append_dev(p8, span5);
    			append_dev(div21, t87);
    			append_dev(div21, div19);
    			append_dev(div19, img6);
    			append_dev(div21, t88);
    			append_dev(div21, div20);
    			append_dev(main, t90);
    			append_dev(main, section2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[23]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[23]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[24]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[25]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[26]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[27]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*menuLines*/ 1) {
    				set_input_value(input0, /*menuLines*/ ctx[0]);
    			}

    			if (dirty[0] & /*menuLines*/ 1 && to_number(input1.value) !== /*menuLines*/ ctx[0]) {
    				set_input_value(input1, /*menuLines*/ ctx[0]);
    			}

    			if (dirty[0] & /*meatToPlant*/ 2 && to_number(input2.value) !== /*meatToPlant*/ ctx[1]) {
    				set_input_value(input2, /*meatToPlant*/ ctx[1]);
    			}

    			if (dirty[0] & /*meatToVeg*/ 4 && to_number(input3.value) !== /*meatToVeg*/ ctx[2]) {
    				set_input_value(input3, /*meatToVeg*/ ctx[2]);
    			}

    			if (dirty[0] & /*vegToPlant*/ 8 && to_number(input4.value) !== /*vegToPlant*/ ctx[3]) {
    				set_input_value(input4, /*vegToPlant*/ ctx[3]);
    			}

    			if (dirty[0] & /*dishesPerDay*/ 16 && to_number(input5.value) !== /*dishesPerDay*/ ctx[4]) {
    				set_input_value(input5, /*dishesPerDay*/ ctx[4]);
    			}

    			if (dirty[0] & /*meatToPlant, meatToVeg, vegToPlant, dishesPerDay*/ 30 && t39_value !== (t39_value = (/*meatToPlant*/ ctx[1] + /*meatToVeg*/ ctx[2] + /*vegToPlant*/ ctx[3]) * /*dishesPerDay*/ ctx[4] * /*daysPerWeek*/ ctx[14] + "")) set_data_dev(t39, t39_value);
    			if (dirty[0] & /*sumCarbon*/ 32 && t49_value !== (t49_value = /*sumCarbon*/ ctx[5].toLocaleString(undefined, { maximumFractionDigits: 3 }) + "")) set_data_dev(t49, t49_value);
    			if (dirty[0] & /*sumCarbon*/ 32 && t56_value !== (t56_value = (/*sumCarbon*/ ctx[5] / /*CARBON_PER_KM*/ ctx[8]).toLocaleString() + "")) set_data_dev(t56, t56_value);
    			if (dirty[0] & /*sumWater*/ 64 && t64_value !== (t64_value = /*sumWater*/ ctx[6].toLocaleString() + "")) set_data_dev(t64, t64_value);
    			if (dirty[0] & /*sumWater*/ 64 && t69_value !== (t69_value = (/*sumWater*/ ctx[6] / /*LITER_PER_BATHTUB*/ ctx[9]).toLocaleString(undefined, { maximumFractionDigits: 0 }) + "")) set_data_dev(t69, t69_value);
    			if (dirty[0] & /*sumLand*/ 128 && t77_value !== (t77_value = /*sumLand*/ ctx[7].toLocaleString(undefined, { maximumFractionDigits: 0 }) + "")) set_data_dev(t77, t77_value);
    			if (dirty[0] & /*sumLand*/ 128 && t84_value !== (t84_value = (/*sumLand*/ ctx[7] / /*SQUARE_METER_PER_PITCH*/ ctx[10]).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "")) set_data_dev(t84, t84_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let carbonMeatToVeg;
    	let carbonMeatToPlant;
    	let carbonVegToPlant;
    	let sumCarbon;
    	let waterMeatToVeg;
    	let waterMeatToPlant;
    	let sumWater;
    	let landMeatToVeg;
    	let landMeatToPlant;
    	let landVegToPlant;
    	let sumLand;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("my-component", slots, []);

    	const ADULT_NUTRITION = 2000,
    		CHILD_NUTRITION = 1800,
    		ADULT_TO_CHILD_FAKTOR = CHILD_NUTRITION / ADULT_NUTRITION,
    		KCAL_MEAT_TO_PLANT = 0.000684,
    		KCAL_MEAT_TO_VEG = 0.00046,
    		KCAL_VEG_TO_PLANT = 0.000224,
    		CARBON_PER_KM = 120 / 1000000,
    		WATER_PER_MEAL = (3000 - 1700) * 0.25,
    		LITER_PER_BATHTUB = 150,
    		LAND_PER_MEAL_MEAT_TO_VEG = 790 / 365 * 0.25,
    		LAND_PER_MEAL_MEAT_TO_PLANT = 970 / 365 * 0.25,
    		LAND_PER_MEAL_VEG_TO_PLANT = (970 - 790) / 365 * 0.25,
    		SQUARE_METER_PER_PITCH = 7140;

    	let menuLines = 2,
    		minMenuLines = 1,
    		maxMenuLines = 7,
    		meatToPlant = 1,
    		meatToVeg = 1,
    		vegToPlant = 1,
    		dishesPerDay = 200,
    		maxDishesPerDay = 10000,
    		daysPerWeek = 5,
    		daysPerYear = 200;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<my-component> was created with unknown prop '${key}'`);
    	});

    	function input0_change_input_handler() {
    		menuLines = to_number(this.value);
    		$$invalidate(0, menuLines);
    	}

    	function input1_input_handler() {
    		menuLines = to_number(this.value);
    		$$invalidate(0, menuLines);
    	}

    	function input2_input_handler() {
    		meatToPlant = to_number(this.value);
    		$$invalidate(1, meatToPlant);
    	}

    	function input3_input_handler() {
    		meatToVeg = to_number(this.value);
    		$$invalidate(2, meatToVeg);
    	}

    	function input4_input_handler() {
    		vegToPlant = to_number(this.value);
    		$$invalidate(3, vegToPlant);
    	}

    	function input5_input_handler() {
    		dishesPerDay = to_number(this.value);
    		$$invalidate(4, dishesPerDay);
    	}

    	$$self.$capture_state = () => ({
    		ADULT_NUTRITION,
    		CHILD_NUTRITION,
    		ADULT_TO_CHILD_FAKTOR,
    		KCAL_MEAT_TO_PLANT,
    		KCAL_MEAT_TO_VEG,
    		KCAL_VEG_TO_PLANT,
    		CARBON_PER_KM,
    		WATER_PER_MEAL,
    		LITER_PER_BATHTUB,
    		LAND_PER_MEAL_MEAT_TO_VEG,
    		LAND_PER_MEAL_MEAT_TO_PLANT,
    		LAND_PER_MEAL_VEG_TO_PLANT,
    		SQUARE_METER_PER_PITCH,
    		menuLines,
    		minMenuLines,
    		maxMenuLines,
    		meatToPlant,
    		meatToVeg,
    		vegToPlant,
    		dishesPerDay,
    		maxDishesPerDay,
    		daysPerWeek,
    		daysPerYear,
    		carbonMeatToVeg,
    		carbonMeatToPlant,
    		carbonVegToPlant,
    		sumCarbon,
    		waterMeatToVeg,
    		waterMeatToPlant,
    		sumWater,
    		landMeatToVeg,
    		landMeatToPlant,
    		landVegToPlant,
    		sumLand
    	});

    	$$self.$inject_state = $$props => {
    		if ("menuLines" in $$props) $$invalidate(0, menuLines = $$props.menuLines);
    		if ("minMenuLines" in $$props) $$invalidate(11, minMenuLines = $$props.minMenuLines);
    		if ("maxMenuLines" in $$props) $$invalidate(12, maxMenuLines = $$props.maxMenuLines);
    		if ("meatToPlant" in $$props) $$invalidate(1, meatToPlant = $$props.meatToPlant);
    		if ("meatToVeg" in $$props) $$invalidate(2, meatToVeg = $$props.meatToVeg);
    		if ("vegToPlant" in $$props) $$invalidate(3, vegToPlant = $$props.vegToPlant);
    		if ("dishesPerDay" in $$props) $$invalidate(4, dishesPerDay = $$props.dishesPerDay);
    		if ("maxDishesPerDay" in $$props) $$invalidate(13, maxDishesPerDay = $$props.maxDishesPerDay);
    		if ("daysPerWeek" in $$props) $$invalidate(14, daysPerWeek = $$props.daysPerWeek);
    		if ("daysPerYear" in $$props) $$invalidate(39, daysPerYear = $$props.daysPerYear);
    		if ("carbonMeatToVeg" in $$props) $$invalidate(15, carbonMeatToVeg = $$props.carbonMeatToVeg);
    		if ("carbonMeatToPlant" in $$props) $$invalidate(16, carbonMeatToPlant = $$props.carbonMeatToPlant);
    		if ("carbonVegToPlant" in $$props) $$invalidate(17, carbonVegToPlant = $$props.carbonVegToPlant);
    		if ("sumCarbon" in $$props) $$invalidate(5, sumCarbon = $$props.sumCarbon);
    		if ("waterMeatToVeg" in $$props) $$invalidate(18, waterMeatToVeg = $$props.waterMeatToVeg);
    		if ("waterMeatToPlant" in $$props) $$invalidate(19, waterMeatToPlant = $$props.waterMeatToPlant);
    		if ("sumWater" in $$props) $$invalidate(6, sumWater = $$props.sumWater);
    		if ("landMeatToVeg" in $$props) $$invalidate(20, landMeatToVeg = $$props.landMeatToVeg);
    		if ("landMeatToPlant" in $$props) $$invalidate(21, landMeatToPlant = $$props.landMeatToPlant);
    		if ("landVegToPlant" in $$props) $$invalidate(22, landVegToPlant = $$props.landVegToPlant);
    		if ("sumLand" in $$props) $$invalidate(7, sumLand = $$props.sumLand);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*meatToVeg, dishesPerDay, menuLines*/ 21) {
    			 $$invalidate(15, carbonMeatToVeg = meatToVeg * dishesPerDay / menuLines * daysPerYear * KCAL_MEAT_TO_VEG * ADULT_TO_CHILD_FAKTOR);
    		}

    		if ($$self.$$.dirty[0] & /*meatToPlant, dishesPerDay, menuLines*/ 19) {
    			 $$invalidate(16, carbonMeatToPlant = meatToPlant * dishesPerDay / menuLines * daysPerYear * KCAL_MEAT_TO_PLANT * ADULT_TO_CHILD_FAKTOR);
    		}

    		if ($$self.$$.dirty[0] & /*vegToPlant, dishesPerDay, menuLines*/ 25) {
    			 $$invalidate(17, carbonVegToPlant = vegToPlant * dishesPerDay / menuLines * daysPerYear * KCAL_VEG_TO_PLANT * ADULT_TO_CHILD_FAKTOR);
    		}

    		if ($$self.$$.dirty[0] & /*carbonMeatToVeg, carbonMeatToPlant, carbonVegToPlant*/ 229376) {
    			 $$invalidate(5, sumCarbon = carbonMeatToVeg + carbonMeatToPlant + carbonVegToPlant);
    		}

    		if ($$self.$$.dirty[0] & /*meatToVeg, dishesPerDay, menuLines*/ 21) {
    			 $$invalidate(18, waterMeatToVeg = meatToVeg * dishesPerDay / menuLines * daysPerYear * WATER_PER_MEAL);
    		}

    		if ($$self.$$.dirty[0] & /*meatToPlant, dishesPerDay, menuLines*/ 19) {
    			 $$invalidate(19, waterMeatToPlant = meatToPlant * dishesPerDay / menuLines * daysPerYear * WATER_PER_MEAL);
    		}

    		if ($$self.$$.dirty[0] & /*waterMeatToVeg, waterMeatToPlant*/ 786432) {
    			// $: waterVegToPlant =
    			// 	((vegToPlant * dishesPerDay) / menuLines) *
    			// 	daysPerYear * WATER_PER_MEAL;
    			 $$invalidate(6, sumWater = waterMeatToVeg + waterMeatToPlant);
    		}

    		if ($$self.$$.dirty[0] & /*meatToVeg, dishesPerDay, menuLines*/ 21) {
    			 $$invalidate(20, landMeatToVeg = meatToVeg * dishesPerDay / menuLines * daysPerYear * LAND_PER_MEAL_MEAT_TO_VEG * ADULT_TO_CHILD_FAKTOR);
    		}

    		if ($$self.$$.dirty[0] & /*meatToPlant, dishesPerDay, menuLines*/ 19) {
    			 $$invalidate(21, landMeatToPlant = meatToPlant * dishesPerDay / menuLines * daysPerYear * LAND_PER_MEAL_MEAT_TO_PLANT * ADULT_TO_CHILD_FAKTOR);
    		}

    		if ($$self.$$.dirty[0] & /*vegToPlant, dishesPerDay, menuLines*/ 25) {
    			 $$invalidate(22, landVegToPlant = vegToPlant * dishesPerDay / menuLines * daysPerYear * LAND_PER_MEAL_VEG_TO_PLANT * ADULT_TO_CHILD_FAKTOR);
    		}

    		if ($$self.$$.dirty[0] & /*landMeatToVeg, landMeatToPlant, landVegToPlant*/ 7340032) {
    			 $$invalidate(7, sumLand = landMeatToVeg + landMeatToPlant + landVegToPlant);
    		}
    	};

    	return [
    		menuLines,
    		meatToPlant,
    		meatToVeg,
    		vegToPlant,
    		dishesPerDay,
    		sumCarbon,
    		sumWater,
    		sumLand,
    		CARBON_PER_KM,
    		LITER_PER_BATHTUB,
    		SQUARE_METER_PER_PITCH,
    		minMenuLines,
    		maxMenuLines,
    		maxDishesPerDay,
    		daysPerWeek,
    		carbonMeatToVeg,
    		carbonMeatToPlant,
    		carbonVegToPlant,
    		waterMeatToVeg,
    		waterMeatToPlant,
    		landMeatToVeg,
    		landMeatToPlant,
    		landVegToPlant,
    		input0_change_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class MyComponent_wc extends SvelteElement {
    	constructor(options) {
    		super();
    		this.shadowRoot.innerHTML = `<style>main{text-align:center;min-width:258px;margin:0 auto;color:#11284a}h1{font-weight:500}h2{font-size:1.2em;font-weight:400}ol{list-style:inside decimal;padding-left:0}ol li{margin-bottom:3rem}ol li::marker{display:inline}ol li h2{display:inline}.flex-wrapper{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}.flex-wrapper--col{flex-direction:column}.flex-wrapper--space-around{justify-content:space-around}.large-icons{font-size:3em;margin:8px 0}.text--large{font-size:1.75em;font-weight:500;text-transform:uppercase}.text--orange{color:#f39529}.text--blue{color:#73c1e9}.text--green{color:#3fab33}.banner{position:relative;display:flex;text-align:left;font-size:0.85em;letter-spacing:0.5px;line-height:1.3;color:white;background-color:#11284a;padding:8px 12px;margin:1rem auto;max-width:500px}.banner .icon{align-self:center;flex:0 0 80px;margin-right:12px}.banner .logo{position:absolute;top:8px;right:6px;width:60px}.banner img{width:100%}.banner .link{position:absolute;right:6px;bottom:6px;font-size:0.7em;font-style:italic}@media(min-width: 640px){.banner{font-size:initial}.banner .icon{flex-basis:100px}.banner .logo{top:12px;right:12px;width:100px}}.inline{display:inline}input{font-family:inherit;font-size:inherit;-webkit-padding:0.4em 0;padding:0.4em;margin:0 0 0.5em 0;box-sizing:border-box;border:1px solid #ccc;border-radius:2px}input:disabled{color:#ccc}input[type="range"]{-webkit-appearance:none;border:none}input[type="range"]:focus{outline:none}input[type="range"]::-webkit-slider-runnable-track{height:8.4px;cursor:pointer;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;background:#3071a9;border-radius:1.3px;border:0.2px solid #010101}input[type="range"]::-webkit-slider-thumb{box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;border:1px solid #000000;height:36px;width:16px;border-radius:3px;background:#ffffff;cursor:pointer;-webkit-appearance:none;margin-top:-14px}input[type="range"]:focus::-webkit-slider-runnable-track{background:#367ebd}input[type="range"]::-moz-range-track{height:8.4px;cursor:pointer;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;background:#3071a9;border-radius:1.3px;border:0.2px solid #010101}input[type="range"]::-moz-range-thumb{box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;border:1px solid #000000;height:36px;width:16px;border-radius:3px;background:#ffffff;cursor:pointer}input[type="range"]::-ms-track{height:8.4px;cursor:pointer;background:transparent;border-color:transparent;border-width:16px 0;color:transparent}input[type="range"]::-ms-fill-lower{background:#2a6495;border:0.2px solid #010101;border-radius:2.6px;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d}input[type="range"]::-ms-fill-upper{background:#3071a9;border:0.2px solid #010101;border-radius:2.6px;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d}input[type="range"]::-ms-thumb{box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;border:1px solid #000000;height:36px;width:16px;border-radius:3px;background:#ffffff;cursor:pointer}input[type="range"]:focus::-ms-fill-lower{background:#3071a9}input[type="range"]:focus::-ms-fill-upper{background:#367ebd}.spacer{height:1rem;margin-top:10rem}@media(min-width: 640px){main{max-width:770px}}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes)
    			},
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{},
    			[-1, -1]
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}
    		}
    	}
    }

    customElements.define("my-component", MyComponent_wc);

    /* demo/src/App.svelte generated by Svelte v3.32.0 */
    const file$1 = "demo/src/App.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let my_component;

    	const block = {
    		c: function create() {
    			main = element("main");
    			my_component = element("my-component");
    			add_location(my_component, file$1, 5, 2, 51);
    			add_location(main, file$1, 4, 0, 42);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, my_component);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
