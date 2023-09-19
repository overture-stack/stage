/*
 *
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import { find } from 'lodash';
import { RepositoryTabKeys, RepositoryTabNames } from '../types';

export type JbrowseFileTypes = 'BAM' | 'VCF';
export type JbrowseTypes = 'jbrowseCircular' | 'jbrowseLinear';
export type JbrowseTitles = 'Circular View' | 'Linear View';
export type JbrowseFileAccess = 'open' | 'controlled';

export const jbrowseDict: {
  allowedFileTypes: JbrowseFileTypes[];
  jbrowseType: JbrowseTypes;
  tabKey: RepositoryTabKeys;
  tabName: RepositoryTabNames;
  title: JbrowseTitles;
}[] = [
  {
    allowedFileTypes: ['VCF'],
    jbrowseType: 'jbrowseCircular',
    tabKey: RepositoryTabKeys.JBROWSE_CIRCULAR,
    tabName: RepositoryTabNames.GENOME_VIEWER,
    title: 'Circular View',
  },
  {
    allowedFileTypes: ['BAM', 'VCF'],
    jbrowseType: 'jbrowseLinear',
    tabKey: RepositoryTabKeys.JBROWSE_LINEAR,
    tabName: RepositoryTabNames.GENOME_VIEWER,
    title: 'Linear View',
  },
];

export const MAX_JBROWSE_FILES = 5;

export const jbrowseAssemblyName = 'hg38';
export const jbrowseAssemblyAlias = 'GRCh38';

export const jbrowseErrors = (jbrowseType: JbrowseTypes) => ({
  selectedFilesUnderLimit: `0 files have been selected. Please select 1-${MAX_JBROWSE_FILES} files to launch JBrowse.`,
  selectedFilesOverLimit: `Too many files have been selected. A maximum of ${MAX_JBROWSE_FILES} files may be selected at once.`,
  compatibleFilesUnderLimit: `Please select 1 to ${MAX_JBROWSE_FILES} files to launch JBrowse. Supported file types: ${find(
    jbrowseDict,
    { jbrowseType },
  )?.allowedFileTypes.join(', ')}. Index files are required.`,
  default: 'Something went wrong.',
});

export const jbrowseFileMetadataQuery = `
  query tableData($filters: JSON) {
  file {
    hits(filters: $filters) {
      edges {
        node {
          file_type
          file {
            index_file {
              file_type
            }
          }
        }
      }
    }
  }
}
`;

// check if file is the right type for jbrowse
// and that it has an index
// MVP: restrict controlled access files
export const checkJbrowseCompatibility = ({
  file_access,
  file_type,
  index_file,
  jbrowseType,
}: {
  file_access: JbrowseFileAccess;
  file_type: JbrowseFileTypes;
  index_file: null | Record<string, any>;
  jbrowseType: JbrowseTypes;
}) =>
  find(jbrowseDict, { jbrowseType })?.allowedFileTypes.includes(file_type) &&
  index_file !== null &&
  file_access === 'open';
