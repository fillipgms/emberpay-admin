interface LoginResponse {
    status: boolean;
    user: User | null;
    msg: string;
    token: string | null;
    qrcode: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    document: string;
    email_verified_at: string | null;
    latest_ip: string | null;
    phone: string;
    birth_date: string;
    veriff_session_id: string;
    google2fa_secret: string;
    verify_google2fa: "1" | "0";
    type: string;
    auto_approve_withdrawal: boolean;
    enabled_withdraw: boolean;
    enabled_deposit: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    approved_account: boolean;
    veriff_enabled: boolean;
    view_user_admin: ViewUserAdmin;
    view_user_approve: ViewUserApprove;
    wallet: UserWallet;
}

interface MeProps {
    name: string;
    email: string;
    cpfOrCnpj: string;
    auto_approve_withdrawal: boolean;
    enabled_withdraw: boolean;
    enabled_deposit: boolean;
    balance: string;
    fee: FeeProps;
}

interface ViewUserAdmin {
    id: number;
    name: string;
    email: string;
    document: string;
    birth_date: string;
    phone: string;
    enabled_withdraw: boolean;
    enabled_deposit: boolean;
    auto_approve_withdrawal: boolean;
    type: string;
    latest_ip: string | null;
    balance: string;
    blocked_balance: string;
    total_in: string;
    total_out: string;
    created_at: string;
}

interface ViewUserApprove {
    id: number;
    name: string;
    email: string;
    document: string;
    type: string;
    veriff_enabled: boolean;
    adress: UserAdress;
    created_at: string;
}

interface UserAdress {
    id: number;
    userId: number;
    bairro: string;
    numero: string;
    logradouro: string;
    cep: string;
    cidade: string;
    complemento: string | null;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface UserWallet {
    id: number;
    userId: number;
    balance: string;
    blocked_balance: string;
    total_in: string;
    total_out: string;
    locked: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface SessionPayload {
    accessToken: string;
    expires: string;
}

interface HomeData {
    available_balance: string;
    blocked_balance: string;
    today_sales: string;
    today_outflows: string;
    sales_count: string;
    outflows_count: string;
    last_7_days: Last7Days[];
}

interface Last7Days {
    date: string;
    sales: number;
    outflows: number;
}

interface TransactionsResponse {
    current_page: number;
    data: Transaction[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinksProps[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    users: TransactionUser[];
}

interface TransactionUser {
    id: number;
    email: string;
}

interface LinksProps {
    url: string | null;
    label: string;
    active: boolean;
}

interface Transaction {
    id: string;
    id_bank: string;
    userName: string;
    userEmail: string;
    getaway: string;
    type: string; // "Entrada" | "Saída"
    status: string; // "Aprovada" | "Pendente" | "Recusada"
    amount: string;
    fee: string;
    split: string;
    origin: string;
    application: string;
    description: string | null;
    payer_name: string;
    payer_document: string;
    credential_description: string;
    webhook: string | null;
    created_at: string;
}

interface AdminUser {
    id: number;
    name: string;
    email: string;
    document: string;
    birth_date: string;
    phone: string;
    enabled_withdraw: boolean;
    enabled_deposit: boolean;
    auto_approve_withdrawal: boolean;
    type: string;
    ban: number;
    latest_ip: string;
    balance: string;
    blocked_balance: string;
    total_in: string;
    total_out: string;
    created_at: string;
}

interface UsersResponse {
    current_page: number;
    data: AdminUser[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinksProps[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Account {
    id: number;
    name: string;
    email: string;
    document: string;
    type: string;
    verify: string;
    created_at: string;
}

interface AccountDetail {
    id: number;
    name: string;
    email: string;
    document: string;
    type: string;
    verify: string;
    phone: string;
    birth_date: string;
    address: UserAdress | null;
    created_at: string;
}

interface AccountImage {
    id: number;
    url: string;
    type: string;
}

interface Fee {
    id: number;
    user_id: number;
    user?: { name: string; email: string };
    limit_withdrawal: string;
    limit_per_day_withdrawal_user: string;
    limit_per_day_withdrawal: string;
    minimum_withdrawal: string;
    minimum_deposit: string;
    max_deposit: string;
    max_deposit_per_day: string;
    fee_withdrawal: string;
    fee_deposit: string;
    fee_withdrawal_fixed: string;
    fee_deposit_fixed: string;
    gateway_deposit_app: string;
    gateway_withdrawal_app: string;
    gateway_deposit_painel: string;
    gateway_withdrawal_painel: string;
    gateway_deposit: string;
    gateway_withdrawal: string;
    deposit_fixed_fee_threshold: string;
    withdrawal_fixed_fee_threshold: string;
    enabled_percent_fee_withdrawal: boolean;
    enabled_percent_fee_deposit: boolean;
    created_at: string;
    updated_at: string;
}

interface MedItem {
    id: number;
    userName: string;
    userEmail: string;
    amount: string;
    med_amount: string;
    id_transaction: string;
    status: string;
    enabled_withdraw: boolean;
    created_at: string;
}

interface MedResponse {
    current_page: number;
    data: MedItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinksProps[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    users: TransactionUser[];
}

interface AccountsResponse {
    current_page: number;
    data: Account[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinksProps[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
