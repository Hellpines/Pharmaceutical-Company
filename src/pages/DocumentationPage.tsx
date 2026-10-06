export const DocumentationPage = () => {

  return (
    <div className="p-6 text-brand-secondary">
      <article className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4 border-b border-border-primary pb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">
            Product documentation
          </p>
          <h1 className="text-4xl font-bold text-brand-dark">
            Pharmaceutical Company Management System
          </h1>
          <p className="text-lg text-brand-secondary">
            This documentation describes the core workflows, operational principles, and business value
            of the application designed for a modern pharmaceutical organization. The platform is
            intended to streamline the management of products, compliance, supply chain operations,
            and internal collaboration across departments such as procurement, quality assurance,
            sales, and logistics.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Overview</h2>
          <p>
            The pharmaceutical company application serves as a centralized digital environment for
            managing the lifecycle of medicines, medical devices, and related operational data. It
            enables users to maintain accurate product records, organize regulatory documentation,
            coordinate supplier interactions, and monitor inventory levels with improved visibility.
            The system is designed to support the strict requirements of the healthcare industry,
            including traceability, validation, compliance, and operational accountability.
          </p>
          <p>
            By consolidating routine data entry and cross-functional workflows into a single system,
            the application reduces manual errors, accelerates operational decision-making, and helps
            teams respond faster to demand changes, supplier issues, and regulatory updates. It also
            supports strategic planning by providing reliable reporting and analytical insights across
            the entire pharmaceutical value chain.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Key Features</h2>
          <ul className="list-disc space-y-2 pl-6 text-brand-secondary">
            <li>
              Product catalog management with detailed information about active ingredients,
              dosage forms, packaging, shelf life, and regulatory classifications.
            </li>
            <li>
              Inventory tracking for stock levels, expiration dates, incoming shipments, outgoing
              distribution, and warehouse allocation.
            </li>
            <li>
              Supplier and contract management to ensure purchasing, pricing, and delivery
              performance are visible and traceable.
            </li>
            <li>
              Documentation control for certificates, quality reports, licenses, batch information,
              and audit trails required by regulatory authorities.
            </li>
            <li>
              Reporting and analytics to support sales forecasting, operational planning,
              product performance monitoring, and compliance reviews.
            </li>
            <li>
              User role management that keeps sensitive pharmaceutical data protected while
              enabling operational access for authorized personnel.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Business Context</h2>
          <p>
            Pharmaceutical companies operate in an environment shaped by strict quality requirements,
            limited product margins, global distribution networks, and rapidly changing regulatory
            expectations. Success depends on consistent documentation, careful coordination among
            multiple teams, and the ability to maintain highly accurate information along every stage of
            the product lifecycle. The application addresses these challenges by creating a unified and
            transparent operational layer across the company.
          </p>
          <p>
            Procurement teams can track supplier performance and compare costs, while warehouse
            teams can monitor stock availability and expiration risks. Sales teams gain access to
            product data needed to respond to customer inquiries, while compliance officers can validate
            records and ensure that all required documentation remains current and properly stored.
            This degree of coordination improves efficiency and reduces delays that can otherwise have
            significant commercial or regulatory consequences.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Operational Workflow</h2>
          <p>
            The workflow begins with the creation or review of product records. Each product entry can
            contain essential data such as product name, category, therapeutic group, active ingredients,
            storage conditions, batch identifiers, and relevant legal or compliance metadata. Once the
            record is validated, it becomes available for downstream processes such as purchasing,
            stock allocation, and sales support.
          </p>
          <p>
            When a shipment is received, the system supports tracking of quantities, quality checks,
            and the matching of goods to purchase orders. Stock movement is then logged through the
            distribution process and can be reviewed in real time by authorized users. If a product is
            close to expiry or unavailable in a warehouse, teams can react based on the latest data,
            helping prevent shortages, waste, and compliance violations.
          </p>
          <p>
            The platform also supports record retention and document lifecycle management, making it
            easier to prepare for inspections, internal audits, and external compliance reviews. This
            is particularly important in the pharmaceutical sector, where both data integrity and
            historical traceability are essential.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Regulatory and Quality Considerations</h2>
          <p>
            Regulatory compliance is central to all pharmaceutical operations. A company must ensure
            that every product, batch, shipment, and quality record complies with local and international
            requirements. The application supports these goals by providing standardized data entry,
            audit-ready records, and traceable activity histories. This allows departments to maintain
            confidence that operations are aligned with approved procedures and legal obligations.
          </p>
          <p>
            Quality assurance teams can use the system to track deviations, document corrective
            actions, and manage periodic reviews. The ability to link records to specific product lots,
            suppliers, and warehouse events provides stronger auditing capabilities and helps the
            organization demonstrate accountability when external regulators ask for proof of process
            control. These capabilities reduce operational risk and increase overall trust in the
            company’s production and distribution practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Data Visibility and Reporting</h2>
          <p>
            A key advantage of the application is the way it turns fragmented operational data into a
            coherent view of the business. Dashboards and reports can provide insight into stock
            turnover, revenue by product category, sales trends, supplier reliability, and inventory
            health. These reports help leadership teams make informed decisions on pricing, product
            mix, procurement strategy, and distribution coverage.
          </p>
          <p>
            Because the system centralizes operational data, managers are less dependent on manual
            spreadsheets or isolated databases. This reduces duplication, shortens reporting cycles,
            and improves the consistency of business decisions. The result is a more responsive and
            accountable organization that can quickly identify risk areas and opportunities for
            optimization.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Security and Access Control</h2>
          <p>
            Security is a critical requirement in pharmaceutical operations because the platform may
            contain business-sensitive data, regulated product information, supplier records, and
            documentation linked to patient safety and regulatory obligations. The application should
            therefore support role-based access control, permission segregation, and secure data handling
            practices to protect information from unauthorized modification or exposure.
          </p>
          <p>
            Role assignments allow departments to access only the information relevant to their work,
            while preserving a clear audit trail of user actions. This approach supports internal
            governance and ensures that data corrections, deletions, and updates are recorded in a way
            that can be reviewed during audits or investigations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-dark">Conclusion</h2>
          <p>
            The pharmaceutical company management application is designed to help organizations manage
            complex operational realities with greater control, transparency, and performance. By
            centralizing product data, inventory information, supplier records, and quality-related
            documentation, the system enables teams to work more efficiently while maintaining the
            highest standards of compliance and product integrity.
          </p>
          <p>
            In a sector where precision matters, the application becomes more than a productivity tool:
            it is a strategic platform for operational excellence, regulatory assurance, and long-term
            business resilience. Its value grows as the company expands, introduces new products, and
            faces increasingly demanding requirements from regulators, partners, and customers.
          </p>
        </section>
      </article>
    </div>
  );
};