"""completedby add

Revision ID: 5cfa5aec4baf
Revises: fe25e9229251
Create Date: 2024-11-30 17:02:59.220532

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5cfa5aec4baf'
down_revision: Union[str, None] = 'fe25e9229251'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('results', sa.Column('test_name', sa.BigInteger(), nullable=False))
    op.drop_column('results', 'student_id')
    op.add_column('tests', sa.Column('completed_by', sa.BigInteger(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tests', 'completed_by')
    op.add_column('results', sa.Column('student_id', sa.BIGINT(), autoincrement=False, nullable=False))
    op.drop_column('results', 'test_name')
    # ### end Alembic commands ###