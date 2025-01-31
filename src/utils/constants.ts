import { decode } from "html-entities";

const NAIRA_HTML_CODE = "&#8358;";
export const NAIRA_TEXT = decode(NAIRA_HTML_CODE);
