import * as $rdf from 'rdflib';
import auth from 'solid-auth-client';
import moment from 'moment';

const FLOW = $rdf.Namespace('http://www.w3.org/2005/01/wf/flow#');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const N = $rdf.Namespace('http://rdfs.org/sioc/ns#');
const FOA = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const TERMS = $rdf.Namespace('http://purl.org/dc/terms/');

class solidRdflib {
    constructor() {
        this.rdf = $rdf;
        this.store = $rdf.graph();
        this.fetcher = new $rdf.Fetcher(this.store);
        this.updateManager = new $rdf.UpdateManager(this.store);
    }

    listData = async (folderName: string) => {
        const folder = this.rdf.sym(folderName);

        await this.fetcher.load(folder);

        // this.updateManager.addDownstreamChangeListener(folder, () => console.log('updated'));
    }

    linkedData = async (statements: Array<Object>, objectType: string = '#Msg') => {
        let subject;

        statements.map(async st => {
            subject = this.rdf.sym(st.object.value);
            if (st.object.value.includes(objectType)) {
                statements.push( ...this.store.match(subject, null, null, subject.doc()));
            }
        });
        return statements;
    }

    findByPredicate = async (content: string, nameSpace: string = FLOW) => {
        const statements = this.store.match(null, nameSpace(content));
        return await this.linkedData(statements);
    }

    getMarker = async (object: Object) => {
        const me = this.rdf.sym(object);
        await this.fetcher.load(me);
        return this.store.any(me, VCARD('fn')).value;
    }

    uniqueId = (prefix: string) => {
        const code = new Date().getUTCMilliseconds();
        return `${prefix}${code}`;
    }

    sendMessage = async(options: Object) => {
        const { chatUrl, message } = options;
        const relativeChat = chatUrl.split('#this')[0];
        const uniqueId = this.uniqueId('Msg');
        const messageSubject = `${relativeChat}#${uniqueId}`;
        const msjSubjectSym =this.rdf.sym(messageSubject);
        const chatsubject = this.rdf.sym(chatUrl);
        const date = new Date().toISOString();
        const insertions = [];
        let result;

        this.session = await auth.currentSession(localStorage);

        insertions.push(new $rdf.Statement(chatsubject, FLOW('message'), msjSubjectSym, chatsubject.doc()));
        insertions.push(new $rdf.Statement(msjSubjectSym, N('content'), message, msjSubjectSym.doc()));
        insertions.push(new $rdf.Statement(msjSubjectSym, TERMS('created'), date, msjSubjectSym.doc()));
        insertions.push(new $rdf.Statement(msjSubjectSym, FOA('maker'), this.rdf.sym(this.session.webId), msjSubjectSym.doc()));
        const maker = await this.getMarker(this.session.webId);
        
        await this.updateManager.update([], insertions, () => {});
        
        return result = {
            content: message,
            date,
            maker,
        }
    }

}

export default new solidRdflib();