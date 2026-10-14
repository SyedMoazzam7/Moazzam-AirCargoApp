// ---- Cost calculator (sample rates, Rs per chargeable kg) ----
const routes = {"Mumbai to Delhi":28,"Delhi to Dubai":85,"Mumbai to Singapore":95,"Chennai to Frankfurt":140,"Delhi to London":150};
const days = {"1":"about 3 days","1.4":"about 2 days","1.9":"next available flight"};
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
document.getElementById("route").innerHTML = Object.keys(routes).map(r => `<option>${r}</option>`).join("");

document.getElementById("calcForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = id => parseFloat(document.getElementById(id).value);
  const actual = v("kg"), volume = v("l") * v("w") * v("h") / 6000;
  const chargeable = Math.max(actual, volume);
  const route = document.getElementById("route").value, mult = document.getElementById("service").value;
  const base = Math.max(chargeable * routes[route] * parseFloat(mult), 1500);
  const fuel = base * 0.12, total = base + fuel;
  document.getElementById("result").innerHTML = `<div class="quote">
    <b class="total">${inr(total)}</b>Estimated cost for ${route}, delivery ${days[mult]}.
    <table><tr><td>Actual weight</td><td>${actual.toFixed(1)} kg</td></tr>
    <tr><td>Volume weight</td><td>${volume.toFixed(1)} kg</td></tr>
    <tr><td>Chargeable weight (higher of the two)</td><td>${chargeable.toFixed(1)} kg</td></tr>
    <tr><td>Freight charge (minimum ₹1,500)</td><td>${inr(base)}</td></tr>
    <tr><td>Fuel surcharge 12%</td><td>${inr(fuel)}</td></tr></table>
    <p><a href="#contact">Send an enquiry</a> to confirm this quote.</p></div>`;
});

// ---- Dashboard ----
const kpis = [
  ["Shipments handled","2,400",""],["Tonnes flown","186",""],["On-time delivery","91.2%","good"],
  ["Delayed shipments","140","bad"],["Avg customs clearance","5.5 hrs",""],["Customer satisfaction","4.4 / 5","good"]
];
document.getElementById("kpis").innerHTML = kpis.map(k => `<div class="kpi ${k[2]}"><b>${k[1]}</b>${k[0]}</div>`).join("");
const months = [["May",24],["Jun",28],["Jul",31],["Aug",34],["Sep",36],["Oct",33]];
const max = Math.max(...months.map(m => m[1]));
document.getElementById("chart").innerHTML = months.map(m =>
  `<div class="bar"><span>${m[1]} t</span><i style="height:${m[1]/max*80}%"></i><span>${m[0]}</span></div>`).join("");

// ---- Shipment tracker (sample data) ----
const shipments = {
  SKY1001: {customer:"MediPharma Exports", cargo:"Medicines, 300 kg (2 to 8 °C)", route:"Mumbai to Dubai", location:"In flight over the Arabian Sea", eta:"15 Oct 2026, 06:30", step:2, handler:"Mumbai Cargo Desk"},
  SKY1002: {customer:"Urban Threads", cargo:"Garments, 450 kg", route:"Delhi to London", location:"Booked, awaiting airport drop-off", eta:"18 Oct 2026, 14:00", step:0, handler:"Delhi Cargo Desk"},
  SKY1003: {customer:"Techline Electronics", cargo:"Circuit boards, 120 kg", route:"Chennai to Frankfurt", location:"Delivered to consignee", eta:"Delivered 12 Oct 2026", step:4, handler:"Chennai Cargo Desk"},
  SKY1004: {customer:"AeroParts India", cargo:"Spare parts, 80 kg", route:"Delhi to Singapore", location:"Held at customs, documents pending", eta:"Delayed, new ETA 16 Oct 2026", step:3, handler:"Delhi Customs Team", delayed:true}
};
const stages = ["Booked","Handed to airline","In flight","Arrived, clearing customs","Delivered"];
document.getElementById("trackForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("sid").value.trim().toUpperCase();
  const s = shipments[id], out = document.getElementById("trackResult");
  if (!s) { out.innerHTML = `<p><b>No shipment found for "${id.replace(/[<>&"]/g,"")}".</b> Check the ID on your booking receipt or <a href="#contact">contact us</a>.</p>`; return; }
  const steps = stages.map((n,i) => `<li class="${i<s.step?"done":i===s.step?(s.delayed?"late":"now"):""}">${n}</li>`).join("");
  out.innerHTML = `<h3>${id}: ${s.delayed?"Delayed":stages[s.step]}</h3><ol class="steps">${steps}</ol>
    <p><b>Customer:</b> ${s.customer}<br><b>Cargo:</b> ${s.cargo}<br><b>Route:</b> ${s.route}<br>
    <b>Current location:</b> ${s.location}<br><b>Expected delivery:</b> ${s.eta}<br><b>Handled by:</b> ${s.handler}</p>`;
});
