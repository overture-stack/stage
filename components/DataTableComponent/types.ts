/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { ColumnDef, HeaderGroup, Row } from '@tanstack/react-table';

export type Field = {
	name: string;
	description: string;
	valueType: string;
	unique?: boolean;
	isArray?: boolean;
	delimiter?: string;
	restrictions?: {
		required?: boolean;
		regex?: string;
		codeList?: string[];
	};
	meta?: {
		displayName?: string;
		examples?: string[];
	};
};
export type tableHeaderProps = {
	title: string;
};

export type Schema<T> = {
	name: string;
	description: string;
	fields: T[];
};

export type SchemaTableProps<T> = {
	schemaMap: Map<number, Schema<T>>;
	getColumns: () => ColumnDef<T, any>[];
};

export type TableHeaderProps<T> = {
	headerGroup: HeaderGroup<T>;
};

export type TableRowProps<T> = {
	row: Row<T>;
	index: number;
};
