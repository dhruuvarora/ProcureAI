/*******************************
 * CONFIG
 *******************************/
const BASE_URL = "http://localhost:8000/api/v1";

/*******************************
 * UTILITIES
 *******************************/
async function api(path, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Something went wrong");
    throw data;
  }
  return data;
}

function $(id) {
  return document.getElementById(id);
}

function clearTable(tableId) {
  $(tableId).querySelector("tbody").innerHTML = "";
}

/*******************************
 * NAVIGATION
 *******************************/
const sections = document.querySelectorAll(".page-section");
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    sections.forEach(sec => sec.classList.remove("visible"));
    $(item.dataset.section).classList.add("visible");
  });
});

/*******************************
 * DASHBOARD STATS
 *******************************/
async function loadStats() {
  try {
    const [categories, vendors, rfps, proposals] = await Promise.all([
      api("/category/get"),
      api("/vendor/get"),
      api("/rfp/get"),
      api("/proposal/get")
    ]);

    $("stat-categories").innerText = categories.data.length;
    $("stat-vendors").innerText = vendors.data.length;
    $("stat-rfps").innerText = rfps.data.length;
    $("stat-proposals").innerText = proposals.data.length;
  } catch {}
}

/*******************************
 * CATEGORIES
 *******************************/
$("createCategoryBtn").onclick = async () => {
  const name = $("categoryName").value;
  if (!name) return alert("Enter category name");

  await api("/category/create", "POST", { category_name: name });
  $("categoryName").value = "";
  loadCategories();
};

async function loadCategories() {
  const res = await api("/category/get");
  clearTable("categoriesTable");

  res.data.forEach(c => {
    $("categoriesTable").querySelector("tbody").innerHTML += `
      <tr>
        <td>${c.category_id}</td>
        <td>${c.category_name}</td>
        <td>—</td>
      </tr>`;
  });
}

/*******************************
 * VENDORS
 *******************************/
$("createVendorBtn").onclick = async () => {
  const payload = {
    vendor_name: $("vendorName").value,
    vendor_email: $("vendorEmail").value,
    vendor_phone: $("vendorPhone").value,
    vendor_organization: $("vendorOrg").value,
    category_id: Number($("vendorCategoryId").value)
  };

  await api("/vendor/register", "POST", payload);
  loadVendors();
};

async function loadVendors() {
  const res = await api("/vendor/get");
  clearTable("vendorsTable");

  res.data.forEach(v => {
    $("vendorsTable").querySelector("tbody").innerHTML += `
      <tr>
        <td>${v.vendor_id}</td>
        <td>${v.vendor_name}</td>
        <td>${v.category_id}</td>
        <td>${v.vendor_email}</td>
        <td>—</td>
      </tr>`;
  });
}

/*******************************
 * RFPS
 *******************************/
$("createRfpBtn").onclick = async () => {
  const payload = {
    title: $("rfpTitle").value,
    description: $("rfpDescription").value,
    budget: Number($("rfpBudget").value),
    delivery_time: $("rfpDelivery").value
  };

  await api("/rfp/create", "POST", payload);
  loadRfps();
};

async function loadRfps() {
  const res = await api("/rfp/get");
  clearTable("rfpsTable");

  res.data.forEach(r => {
    $("rfpsTable").querySelector("tbody").innerHTML += `
      <tr>
        <td>${r.rfp_id}</td>
        <td>${r.title}</td>
        <td>${r.budget}</td>
        <td>${r.delivery_time}</td>
        <td>—</td>
      </tr>`;
  });
}

/*******************************
 * PROPOSALS
 *******************************/
$("createProposalBtn").onclick = async () => {
  const payload = {
    rfp_id: Number($("proposalRfpId").value),
    vendor_id: Number($("proposalVendorId").value),
    raw_email_text: $("proposalText").value
  };

  await api("/proposal/create", "POST", payload);
  loadProposals();
};

async function loadProposals() {
  const res = await api("/proposal/get");
  clearTable("proposalsTable");

  res.data.forEach(p => {
    $("proposalsTable").querySelector("tbody").innerHTML += `
      <tr>
        <td>${p.proposal_id}</td>
        <td>${p.rfp_id}</td>
        <td>${p.vendor_id}</td>
        <td>—</td>
      </tr>`;
  });
}

/*******************************
 * AI INSIGHTS
 *******************************/
$("compareRfpBtn").onclick = async () => {
  const rfpId = $("aiCompareRfpId").value;
  if (!rfpId) return alert("Enter RFP ID");

  const res = await api(`/rfp/${rfpId}/compare`);
  $("aiOutput").innerText = JSON.stringify(res, null, 2);
};

/*******************************
 * INITIAL LOAD
 *******************************/
loadStats();
loadCategories();
loadVendors();
loadRfps();
loadProposals();
