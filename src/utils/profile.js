import * as $rdf from 'rdflib';
import auth from 'solid-auth-client';
import { NotificationManager } from 'react-notifications';
import  defaultConst from '../constants';

class Profile {
  store = $rdf.graph();
  session: Object;
  fetcher = new $rdf.Fetcher(this.store);
  updateManager = new $rdf.UpdateManager(this.store);

  /**
    * Fetches the session from Solid, and store results in localStorage
  */
  getSession = async() => {
    this.session = await auth.currentSession(localStorage);
  }
  
  /**
    * Get Node Object key from statement
  */
  getStatementsName(statements: Object) {
    return statements.split('#')[1].replace(/[^a-z0-9]+|\s+/gmi, '');
  }

  vcardToArray = async(doc: string) => {
    await this.fetcher.load(doc);

    const cardData = this.store.match($rdf.sym(doc));
    const filterData = cardData.filter(statements => statements.predicate.value.includes('#') &&
    !statements.predicate.value.includes('account') && !statements.predicate.value.includes('type') &&
    !statements.object.value.includes('.ttl') && !statements.predicate.value.includes('inbox')
    && !statements.predicate.value.includes('storage'));
    let label;
    let iconObject;

    const basicData = filterData.map(statements => {
      label = this.getStatementsName(statements.predicate.value);
      iconObject = defaultConst.PROFILEICONS.find(icon => icon.label === label);

      return {
        label,
        icon: iconObject && iconObject.value || '',
        ...statements
      };
    });

    return basicData;
  }


  syncVcardLink = async(statements: Array<Object>) => {
    const newStatements: Array<Object> = [];

    await Promise.all(statements.map(async st => {
      if (st.object.value.includes('#id')) {
        newStatements.push( await this.vcardToArray(st.object.value));
      }
    }));
    return newStatements;
  }

  getProfileCard = async() => {
    if (!this.session) {
      await this.getSession();
    }
    await this.fetcher.load(this.session.webId);

    const statements = await this.vcardToArray(this.session.webId);
    const linkData = await this.syncVcardLink(statements);
    const updatedStatements = statements.concat(...linkData);
    const profileImages = updatedStatements.filter(st => st.label === 'hasPhoto');
     /*
     * Will remove link data that used only to reference to link other information and images
     *
    */
    const filterDataLink = updatedStatements.filter(st => !st.object.value.includes('#id') && st.label !== 'hasPhoto');
    const result = {
      data: filterDataLink,
      images: profileImages
    };

    return result;
  };

  createStatment(data, value) {
    const predicate = data.predicate;
    const subject = data.subject;
    return $rdf.st(subject, predicate, value, data.why);
  }

  updateState(oldStatment, statment) {
    const keys = Object.keys(statment);
    return oldStatment.map(field => {
      if (keys.find(f => f === field.label)) {
        return this.createStatment(field, keys[field.label]);
      }
      return field;
    });
  }

  async updateProfile(oldFields, updatedFields) {
    try {
      if (updatedFields) {
        const updatedFieldsKeys = Object.keys(updatedFields);
        const deletions = oldFields.filter(field => updatedFieldsKeys.find(f => f === field.label));
        const insertions = [];

        deletions.map(field => {
          insertions.push(this.createStatment(field, updatedFields[field.label]));
        });

        await this.updateManager.update(deletions, insertions, (response, success, message) =>{
          if (!success) {
            NotificationManager.error('An error has occurred');
          }
        });

        NotificationManager.success('Your Solid profile has been successfully updated');
      }
    } catch(err) {
      NotificationManager.error('An error has occurred');
    }
  }
}

export default new Profile();