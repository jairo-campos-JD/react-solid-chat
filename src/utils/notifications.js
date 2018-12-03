import * as $rdf from 'rdflib';

const LDP = $rdf.Namespace('http://www.w3.org/ns/ldp#');
const TERMS = $rdf.Namespace('http://purl.org/dc/terms/');
const ST = $rdf.Namespace('http://www.w3.org/ns/posix/stat#');

import { uniqueId } from './';

class Notifications {
    rdf;
    updateManager;
    constructor() {
        this.store = $rdf.graph();
        this.fetcher = new $rdf.Fetcher(this.store);
        this.updateManager = new $rdf.UpdateManager(this.store);
    }

    createNotification = async(options) => {
        const { type, actor, target } = options;
        const idp = actor.value.split('/profile')[0];
        const inboxUrl = `${idp}/inbox`;
        const notificationId = uniqueId('notification');
        const inboxSubject = $rdf.sym(inboxUrl);
        const notificationSubject = $rdf.sym(`${inboxUrl}/${notificationId}`);
        const date = new Date().toISOString();
        const insertions = [];

        console.log(inboxSubject, 'inbox url', notificationSubject);

        await this.fetcher.load(inboxSubject);

        await this.fetcher.webOperation('POST', notificationSubject.uri, { });
        insertions.push(new $rdf.Statement(inboxSubject, LDP('contains'), notificationSubject, inboxSubject.doc()));
        insertions.push(new $rdf.Statement(inboxSubject, LDP('contains'), notificationSubject, inboxSubject.doc()));
        insertions.push(new $rdf.Statement(notificationSubject, ST('type'), type, notificationSubject.doc()));
        insertions.push(new $rdf.Statement(notificationSubject, ST('actor'), actor, notificationSubject.doc()));
        insertions.push(new $rdf.Statement(notificationSubject, ST('target'), target, notificationSubject.doc()));
        insertions.push(new $rdf.Statement(notificationSubject, TERMS('modified'), date, notificationSubject.doc()));

        await this.updateManager.update([], insertions, () => {});
    }

    loadNotification =  async(inboxUrl) => {
        const inboxSubject = $rdf.sym(inboxUrl);
        await this.fetcher.load(inboxSubject);
    }
}

export default new Notifications();