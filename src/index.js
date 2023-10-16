/*
 *
 *** Site: Mohammed Alkebsi's personal portfolio
 *** Author: Mohammed Alkebsi (MKebsi)
 *** URL: https://alkebsi.github.io/
 *** License: OpenSource - Apache 2.0
 *** Credits: [Project Credits]
 *** Case Study: [if any! + stating if it is a case study] (Comming Soon...)
 *
 * ------------------------------------------------
 * Note: First, the window keyword is ommited from the entire
 * project since it is useless at the moment; that is, instead
 * of writing `window.setTimeout` I wrote `setTimeout`. Second,
 * 
 * ------------------------------------------------
 *
 */
import './style.css';

import SiteManager from './App/SiteManager';

const canvas = document.getElementById('webgl');
const siteManager = new SiteManager(canvas);
