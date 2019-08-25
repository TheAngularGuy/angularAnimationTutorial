import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

interface Contact {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

const CONTACTS_MOCK: Contact[] = new Array(5)
  .fill({})
  .map(
    (c: Contact, i: number) =>
      ({
        id: i,
        name: `Contact ${i}`,
        email: `email${i}@provider.com`,
        avatarUrl: `https://api.adorable.io/avatars/100/${~~(Math.random() * 100)}`,
      } as Contact),
  )
  .reverse(); // * to have them sorted in DESC order

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('noEnterAnimation', [transition(':enter', [])]),
    trigger('listItemAnimation', [
      transition(':enter', [
        style({ height: '0px', overflow: 'hidden' }),
        group([animate('250ms ease-out', style({ height: '!' }))]),
      ]),
      transition(':leave', [
        style({ height: '!', overflow: 'hidden' }),
        group([animate('250ms ease-out', style({ height: '0px' }))]),
      ]),
    ]),
    trigger('sideContentAnimation', [
      transition(':enter', [
        style({ width: '0px', overflow: 'hidden' }),
        group([
          query('.side-list-content-data-inner', [
            style({ transform: 'translateX(-110%)' }),
            group([animate('250ms ease-out', style({ transform: 'translateX(-0%)' }))]),
          ]),
          animate('250ms ease-out', style({ width: '!' })),
        ]),
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        group([
          query('.side-list-content-data-inner', [
            style({ transform: 'translateX(-0%)' }),
            group([animate('250ms ease-out', style({ transform: 'translateX(-110%)' }))]),
          ]),
          animate('250ms ease-out', style({ width: '0' })),
        ]),
      ]),
    ]),
    trigger('emptyContentAnimation', [
      transition(':leave', [
        style({ opacity: '1' }),
        group([animate('250ms ease-out', style({ opacity: '0', width: '0px' }))]),
      ]),
      transition(':enter', [
        style({ opacity: '0', width: '0px' }),
        group([animate('250ms ease-in', style({ opacity: '1', width: '!' }))]),
      ]),
    ]),
  ],
})
export class ListComponent {
  contactList: Contact[] = CONTACTS_MOCK;
  selectedContact: Contact;

  onSelectItem(contact: Contact) {
    // * selecting a contact to focus on
    this.selectedContact = contact ? { ...contact } : null;
  }

  onAddItem() {
    const rndNum = Date.now();
    const newContact: Contact = {
      id: this.contactList.length * rndNum,
      name: `Contact ${this.contactList.length}`,
      email: `email${this.contactList.length}@provider.com`,
      avatarUrl: `https://api.adorable.io/avatars/285/${rndNum}`,
    };
    // * adding a new contact to the list
    this.contactList = [newContact, ...this.contactList];
    // * selecting the newly created contact
    this.onSelectItem(newContact);
  }

  onDeleteItem(contact: Contact) {
    // * removing a contact from the list
    this.contactList = this.contactList.filter(c => c.id != contact.id);
    if (this.selectedContact && this.selectedContact.id == contact.id) {
      // * if the removed contact is beaing focused on, then we remove the focus
      this.onSelectItem(null);
    }
  }
}
