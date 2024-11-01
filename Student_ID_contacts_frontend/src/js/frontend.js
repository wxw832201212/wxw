document.addEventListener('DOMContentLoaded', () => {
    const contactsList = document.getElementById('contacts-list');
    const addContactForm = document.getElementById('add-contact-form');
    const searchForm = document.getElementById('search-contact-form');
    let currentUpdateContactId = null;
  
    // 提取获取联系人列表函数
    const fetchContacts = async (query = '') => {
        try {
            let url = 'http://114.55.128.122:3000/api/contacts';
            if (query) {
                url += `/search?name=${query}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const contacts = await response.json();
            contactsList.innerHTML = '';
            contacts.forEach(contact => {
                const contactRow = document.createElement('tr');
                contactRow.id = `contact-row-${contact.id}`;
                contactRow.innerHTML = `
                    <td>${contact.name}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.email || ''}</td>
                    <td>${contact.special_interest ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}', '${contact.email}', ${contact.special_interest})">Edit</button>
                        <button class="btn btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                    </td>
                `;
                contactsList.appendChild(contactRow);
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            contactsList.textContent = 'Unable to fetch contacts. Please try again later.';
        }
    };
  
    // 搜索联系人事件处理
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('search-name').value;
        await fetchContacts(query);
    });
  
    // 添加联系人事件处理
    addContactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (currentUpdateContactId) {
            await updateContactAndRemoveRow();
        } else {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const specialInterest = document.getElementById('special-interest').checked;
  
            try {
                const response = await fetch('http://114.55.128.122:3000/api/contacts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, email, special_interest: specialInterest })
                });
                if (response.ok) {
                    await fetchContacts();
                    // 清空输入框
                    document.getElementById('name').value = '';
                    document.getElementById('phone').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('special-interest').checked = false;
                    currentUpdateContactId = null; // 清空更新ID
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            } catch (error) {
                console.error('Error adding contact:', error);
                alert('A network error occurred while adding a contact. Please check your connection and try again.');
            }
        }
    });
  
    // 删除联系人事件处理
    const deleteContact = async (id) => {
        try {
            const response = await fetch(`http://114.55.128.122:3000/api/contacts/${id}`, { method: 'DELETE' });
            if (response.ok) {
                const rowToDelete = document.getElementById(`contact-row-${id}`);
                if (rowToDelete) {
                    rowToDelete.remove();
                }
            } else {
                alert('Failed to delete contact. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('A network error occurred while deleting a contact. Please check your connection and try again.');
        }
    };
    window.deleteContact = deleteContact;
  
    // 编辑联系人事件处理
    const editContact = (id, name, phone, email, specialInterest) => {
        currentUpdateContactId = id;
        document.getElementById('name').value = name;
        document.getElementById('phone').value = phone;
        document.getElementById('email').value = email;
        document.getElementById('special-interest').checked = specialInterest;
        addContactForm.scrollIntoView();
  
        // 删除对应行
        const rowToDelete = document.getElementById(`contact-row-${id}`);
        if (rowToDelete) {
            rowToDelete.remove();
        }
    };
    window.editContact = editContact;
  
    // 更新联系人并删除原行函数
    const updateContactAndRemoveRow = async () => {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const specialInterest = document.getElementById('special-interest').checked;
  
        try {
            const response = await fetch(`http://114.55.128.122:3000/api/contacts/${currentUpdateContactId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, special_interest: specialInterest })
            });
            if (response.ok) {
                await fetchContacts();
                // 清空输入框
                document.getElementById('name').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('email').value = '';
                document.getElementById('special-interest').checked = false;
                currentUpdateContactId = null; // 清空更新ID
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error('Error updating contact:', error);
            alert('A network error occurred while updating a contact. Please check your connection and try again.');
        }
    };
  
    // 初始获取联系人列表
    fetchContacts();
  });
  