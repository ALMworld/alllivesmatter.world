// To parse this data:
//
//   import { Convert, DataTypes } from "./file";
//
//   const dataTypes = Convert.toDataTypes(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DataTypes {
    title:         string;
    menu_data:     MenuData;
    common_data:   CommonData;
    advocacy_data: AdvocacyData;
    how_data:      HowData;
    why_data:      WhyData;
    about_data:    AboutData;
}

export interface AboutData {
    title:                   string;
    watch_interview_text:    string;
    watch_news_text:         string;
    invitation_letter_text:  string;
    invitation_letter:       string;
    video_spirit_disclaimer: string;
    sections:                string[];
    links:                   Links;
    faq_list:                FAQList[];
}

export interface FAQList {
    question:           string;
    answer_image_list?: string[];
    answers:            string[];
    _answers?:          string[];
    hide_answers?:      string[];
}

export interface Links {
    warning: Puppet;
    puppet:  Puppet;
}

export interface Puppet {
    title: string;
    url:   string;
}

export interface AdvocacyData {
    attitude:               string;
    bestwishes:             string;
    dukige_definition:      string;
    duki_definition:        string;
    slogan:                 string;
    slogan_headline:        string;
    slogan_headline_suffix: string;
    slogan_target_part:     string;
    slogan_highlight_part:  string;
    advocacy_details:       AdvocacyDetail[];
}

export interface AdvocacyDetail {
    content:     string;
    description: string;
    buttonText:  string;
    icon:        string;
    keyPoints:   KeyPoint[];
}

export interface KeyPoint {
    title:       string;
    description: string;
}

export interface CommonData {
    share_text:        string;
    share_url:         string;
    share_advocacy:    string;
    duki_terms_header: string;
    duki_terms:        DukiTerm[];
}

export interface DukiTerm {
    term:       string;
    definition: string;
    icon:       string;
}

export interface HowData {
    contribute_text:           string;
    contribute_by_share_text:  string;
    contribute_by_action_text: string;
}

export interface MenuData {
    label:    string;
    about:    string;
    why:      string;
    how:      string;
    advocacy: string;
}

export interface WhyData {
    highlight: Highlight;
    books:     Book[];
}

export interface Book {
    author:      string;
    title:       string;
    author_link: string;
    link:        string;
    intro:       string;
    get_book:    GetBook[];
    topic1:      Topic;
    topic2:      Topic;
}

export interface GetBook {
    buy_url:    string;
    buy_text:   string;
    store_icon: string;
}

export interface Topic {
    headline: string;
    content:  string;
}

export interface Highlight {
    situation:         string;
    question:          string;
    question_emphasis: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDataTypes(json: string): DataTypes {
        return cast(JSON.parse(json), r("DataTypes"));
    }

    public static dataTypesToJson(value: DataTypes): string {
        return JSON.stringify(uncast(value, r("DataTypes")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "DataTypes": o([
        { json: "title", js: "title", typ: "" },
        { json: "menu_data", js: "menu_data", typ: r("MenuData") },
        { json: "common_data", js: "common_data", typ: r("CommonData") },
        { json: "advocacy_data", js: "advocacy_data", typ: r("AdvocacyData") },
        { json: "how_data", js: "how_data", typ: r("HowData") },
        { json: "why_data", js: "why_data", typ: r("WhyData") },
        { json: "about_data", js: "about_data", typ: r("AboutData") },
    ], false),
    "AboutData": o([
        { json: "title", js: "title", typ: "" },
        { json: "watch_interview_text", js: "watch_interview_text", typ: "" },
        { json: "watch_news_text", js: "watch_news_text", typ: "" },
        { json: "invitation_letter_text", js: "invitation_letter_text", typ: "" },
        { json: "invitation_letter", js: "invitation_letter", typ: "" },
        { json: "video_spirit_disclaimer", js: "video_spirit_disclaimer", typ: "" },
        { json: "sections", js: "sections", typ: a("") },
        { json: "links", js: "links", typ: r("Links") },
        { json: "faq_list", js: "faq_list", typ: a(r("FAQList")) },
    ], false),
    "FAQList": o([
        { json: "question", js: "question", typ: "" },
        { json: "answer_image_list", js: "answer_image_list", typ: u(undefined, a("")) },
        { json: "answers", js: "answers", typ: a("") },
        { json: "_answers", js: "_answers", typ: u(undefined, a("")) },
        { json: "hide_answers", js: "hide_answers", typ: u(undefined, a("")) },
    ], false),
    "Links": o([
        { json: "warning", js: "warning", typ: r("Puppet") },
        { json: "puppet", js: "puppet", typ: r("Puppet") },
    ], false),
    "Puppet": o([
        { json: "title", js: "title", typ: "" },
        { json: "url", js: "url", typ: "" },
    ], false),
    "AdvocacyData": o([
        { json: "attitude", js: "attitude", typ: "" },
        { json: "bestwishes", js: "bestwishes", typ: "" },
        { json: "dukige_definition", js: "dukige_definition", typ: "" },
        { json: "duki_definition", js: "duki_definition", typ: "" },
        { json: "slogan", js: "slogan", typ: "" },
        { json: "slogan_headline", js: "slogan_headline", typ: "" },
        { json: "slogan_headline_suffix", js: "slogan_headline_suffix", typ: "" },
        { json: "slogan_target_part", js: "slogan_target_part", typ: "" },
        { json: "slogan_highlight_part", js: "slogan_highlight_part", typ: "" },
        { json: "advocacy_details", js: "advocacy_details", typ: a(r("AdvocacyDetail")) },
    ], false),
    "AdvocacyDetail": o([
        { json: "content", js: "content", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "buttonText", js: "buttonText", typ: "" },
        { json: "icon", js: "icon", typ: "" },
        { json: "keyPoints", js: "keyPoints", typ: a(r("KeyPoint")) },
    ], false),
    "KeyPoint": o([
        { json: "title", js: "title", typ: "" },
        { json: "description", js: "description", typ: "" },
    ], false),
    "CommonData": o([
        { json: "share_text", js: "share_text", typ: "" },
        { json: "share_url", js: "share_url", typ: "" },
        { json: "share_advocacy", js: "share_advocacy", typ: "" },
        { json: "duki_terms_header", js: "duki_terms_header", typ: "" },
        { json: "duki_terms", js: "duki_terms", typ: a(r("DukiTerm")) },
    ], false),
    "DukiTerm": o([
        { json: "term", js: "term", typ: "" },
        { json: "definition", js: "definition", typ: "" },
        { json: "icon", js: "icon", typ: "" },
    ], false),
    "HowData": o([
        { json: "contribute_text", js: "contribute_text", typ: "" },
        { json: "contribute_by_share_text", js: "contribute_by_share_text", typ: "" },
        { json: "contribute_by_action_text", js: "contribute_by_action_text", typ: "" },
    ], false),
    "MenuData": o([
        { json: "label", js: "label", typ: "" },
        { json: "about", js: "about", typ: "" },
        { json: "why", js: "why", typ: "" },
        { json: "how", js: "how", typ: "" },
        { json: "advocacy", js: "advocacy", typ: "" },
    ], false),
    "WhyData": o([
        { json: "highlight", js: "highlight", typ: r("Highlight") },
        { json: "books", js: "books", typ: a(r("Book")) },
    ], false),
    "Book": o([
        { json: "author", js: "author", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "author_link", js: "author_link", typ: "" },
        { json: "link", js: "link", typ: "" },
        { json: "intro", js: "intro", typ: "" },
        { json: "get_book", js: "get_book", typ: a(r("GetBook")) },
        { json: "topic1", js: "topic1", typ: r("Topic") },
        { json: "topic2", js: "topic2", typ: r("Topic") },
    ], false),
    "GetBook": o([
        { json: "buy_url", js: "buy_url", typ: "" },
        { json: "buy_text", js: "buy_text", typ: "" },
        { json: "store_icon", js: "store_icon", typ: "" },
    ], false),
    "Topic": o([
        { json: "headline", js: "headline", typ: "" },
        { json: "content", js: "content", typ: "" },
    ], false),
    "Highlight": o([
        { json: "situation", js: "situation", typ: "" },
        { json: "question", js: "question", typ: "" },
        { json: "question_emphasis", js: "question_emphasis", typ: "" },
    ], false),
};
